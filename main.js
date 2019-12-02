const imgSizes = {
    backdrop_sizes: ["w300", "w780", "w1280", "original"],
    logo_sizes: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
    poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
    profile_sizes: ["w45", "w185", "h632", "original"],
    still_sizes: ["w92", "w185", "w300", "original"]
  };
const app ={
    baseImg:'https://image.tmdb.org/t/p/',
    key: "e65e3615d5748aa10525c03bd03b3005",
    person: [],
    active:'search',
    baseURL: null,
    movie:[],
    cast:[],
    pages:[],

    //Initialize Content from here
    init:()=>{
        app.pages = document.querySelectorAll('.page');
        let searchBtn = document.getElementById('btnClick');
        let homeIcon = document.querySelectorAll('.fab');
        let searchBar = document.getElementById("search_input");   
         
        //Search button
        searchBtn.addEventListener('click', function(ev){
            
            if(searchBar.value){
                app.person=[];
                app.nav(ev);
                app.inputName();
            }
            else{
                return
            }
            });
        homeIcon.forEach(item=>{
            item.addEventListener('click', function(ev){
                app.nav(ev);
                
                });
        });
        searchBar.addEventListener('keypress', function(event){
            if(event.keyCode === 13){
                searchBtn.click();
                event.preventDefault();
            }
        })
        window.addEventListener('popstate', app.pop);
        let url = location.href;
        if(location.hash){

        console.log('if');
            app.baseURL = url.split('#')[0];
            app.changePage(url.split('#')[1]);

        }else{
            //Alert 
            console.log('else');
            app.baseURL = url;
            app.changePage(app.active);
            history.replaceState({}, app.active, url + "#" + app.active);
        }
        
        
    },
    pop: (ev)=>{
        ev.preventDefault();
        //Back button 
        let id = location.hash.replace('#', '');
        app.changePage(id);  
    },

    changePage: (target)=>{
        //Changing page
        document.querySelector('.active').classList.remove('active');
        document.querySelector(`#${target}`).classList.add('active');
    
      },

    nav: (ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        let link = ev.target.closest('[data-href]');
        let target = link.getAttribute('data-href');
        history.pushState({},target,app.baseURL+ "#" +target);
        app.changePage(target);
        
    },

    inputName:(ev)=>{
        let name = "" + document.getElementById('search_input').value;
        let url = `https://api.themoviedb.org/3/search/person?api_key=${app.key}&query=${name}&include_aldult=true&language=en-US`;
        fetch(url)
        .then(response => response.json())
        .then (data => {
            app.getName(data.results);      
        })
        .catch(err =>{
            console.log(err);
        });
    },

    getName: (data)=>{ 
        if(data.length == 0){
            alert('We are sorry, we could not find your searching. Please come back and try again !');
        }else{
            data.forEach( item => {
                app.person.push(item);
            });
            app.appendName(app.person);
            console.log(app.person);

        }
       
    },

    appendName: (data)=>{
        let div = document.getElementById('actors');
        let links = div.querySelectorAll('li');   
        if(links.length == 0){
        data.forEach( item => {   
            app.createName(item,path="profile_path",list=".list_actors",type="name",attr="movies",id=item.name,media="");
            
        }); 
              
        }
        else{       
            data.forEach((item,index)=>{   
                app.replaceName(item,index,links,path="profile_path",list=".list_actors",type="name",attr="movies",id=item.name,media="",para="id") ;  
                                    
            }); 
                
            } 
            app.navMovie();  
    },

    navMovie:()=>{
            let div = document.querySelector("#actors");
            let ol = div.querySelector('ol');
            let links = ol.querySelectorAll('[data-href]');
            links.forEach(link => {
            link.addEventListener('click', function (ev){
                app.nav(ev);
                app.getMovie(ev);  
                   
            });
        });
    },

    getMovie:(ev) =>{ 
            
        let div =document.getElementById("movies");
        let ol = div.querySelector('ol');
        let links = ol.querySelectorAll('li');
        let actor = document.getElementById('actor');
        let target =  ev.target.closest('[data-href]');
        let name = target.getAttribute('id');
        app.person.forEach(item=>{
            if (name == item.name){
                let h1 = actor.querySelector('h1');
                let img = actor.querySelector('img');
                h1.textContent=item.name;
                if(item.profile_path == null){
                    img.src="user.svg";
                    img.height="276";
                    img.width="185";
                }else{
                    img.src = app.baseImg + imgSizes.backdrop_sizes[0] + item.profile_path;
                }
                
                if(links.length == 0){
                    item.known_for.forEach(movie=>{ 
                        if(movie.media_type=="movie") {
                            app.createName(movie,path="poster_path",list=".list_movies",type="title",attr="movie_detail",id=movie.id,media=movie.media_type);
                        } else if(movie.media_type=="tv")  {
                            app.createName(movie,path="poster_path",list=".list_movies",type="name",attr="movie_detail",id=movie.id,media=movie.media_type);
                        } 
                        
                        
                    });       
                    }
                else{    
                        
                        item.known_for.forEach((movie,index)=>{  
                            
                            if(movie.media_type=="movie") {

                                app.replaceName(movie,index,links,path="poster_path",list=".list_movies",type="title",attr="movie_detail",id=movie.id ,media=movie.media_type,para="media-type") ;
                            } else if(movie.media_type=="tv")  {
                                app.replaceName(movie,index,links,path="poster_path",list=".list_movies",type="name",attr="movie_detail",id=movie.id ,media=movie.media_type,para="media-type") ;
                            }                                                           
                        });      
                    } 
            }        
        });
       
        app.navDetail();                  
    },

    navDetail:()=>{
            
            let div = document.getElementById("movies");   
            let ol = div.querySelector('ol');
            let links = ol.querySelectorAll('[data-href]');
            links.forEach(link => {
                link.addEventListener('click', function (ev){
                    app.movie=[];
                    let target = ev.target.closest('[data-href]');
                    let movie_id = target.getAttribute('id');
                    let media = target.getAttribute('media-type');
                    app.nav(ev); 
                    app.inputMovie(movie_id,media);  
                });
            });
    },

     inputMovie:(movie_id,media)=>{
         let url = `https://api.themoviedb.org/3/${media}/${movie_id}?api_key=${app.key}&language=en-US`;
         let urlCast = `https://api.themoviedb.org/3/${media}/${movie_id}/credits?api_key=${app.key}&language=en-US`;
         console.log(url);
         console.log(urlCast);
         fetch(url)
         .then(response => response.json())
         .then(data=> { 
            app.getMovieDetail(data);})
         .catch(err =>{
            console.log(err);
        });

         fetch(urlCast)
         .then(response => response.json())
         .then(data=>{
            
             app.getCast(data);
         })
         .catch(err =>{
            console.log(err);
        });
     },

     getCast:(data)=>{
        let div = document.getElementById('movie_detail');
        let ol = div.querySelector('ol');
        let links = ol.querySelectorAll('li');
        if(links.length == 0){
            data.cast.forEach( (item)=>{
                app.appendCast(item);
            });
           
        }else{
            data.cast.forEach( (item,index)=>{
               
                app.replaceCast(item,index,links);
            });
            
        }
        
     },

     getMovieDetail:(data)=>{
        let div = document.getElementById('movie_detail');
        let h1 = div.querySelector('h1');
        if(data.name){
            h1.textContent = data.name;
        }else if(data.title){
            h1.textContent = data.title;
        } 
        let img = div.querySelector('img');
        img.atl="backdrop";
        img.src=app.baseImg+ imgSizes.backdrop_sizes[1] + data.backdrop_path;
        
        let year = div.querySelector('.year span');
        if(data.release_date){
           
            year.textContent = data.release_date.substring(0,4);
        }else if(data.first_air_date){
           
            year.textContent = data.first_air_date.substring(0,4);
        } 
        let span = div.querySelector('.genre span');
        let genres =[];
        data.genres.forEach(genre=>{
            genres.push(genre.name);
             
        });
       
        span.textContent = genres.join(" | ");

     },   
     appendCast:(item)=>{
        let div = document.getElementById('movie_detail');
        let ol = div.querySelector('ol');
        let li = document.createElement('li');
        let p1 = document.createElement('p');
        p1.setAttribute("class","char");
        let p2 = document.createElement('p');
        p2.setAttribute("class", "act");
        let span1 = document.createElement('span');
        let span2 = document.createElement('span')
        let img = document.createElement('img');
        let character = item.character;
        let name = item.name;
        let path = item.profile_path;
        p1.textContent = "Character: ";
        p2.textContent = "Actor/Actress: ";
        span1.textContent = character;
        span2.textContent = name;
        if(path == null){
            img.src="user.svg";
            img.height="276";
            img.width="185";
        }else{
            img.src = app.baseImg + imgSizes.profile_sizes[1] + path;
        
        }
        img.atl = "profile";
        ol.appendChild(li);
        li.insertAdjacentElement('afterbegin',p2);
        p2.appendChild(span2);
        li.insertAdjacentElement('afterbegin',p1);
        p1.appendChild(span1);
        li.insertAdjacentElement('afterbegin',img);
        

     },
     replaceCast:(item,index,links)=>{
         
        let li = links[index];
        if(index < links.length){
            let span1 = li.querySelector('.char span');
            let span2 = li.querySelector('.act span');
            let img = li.querySelector('img');
            let character = item.character;
            let name = item.name;
            let path = item.profile_path;
            span1.textContent = character;
            span2.textContent = name;
            if(path == null){
                img.src="user.svg";
                img.height="276";
                img.width="185";
            }else{
                img.src = app.baseImg + imgSizes.profile_sizes[1] + path;
           
            }
            img.atl = "profile";
        }else if(index >= links.length){
            app.appendCast(item);
        }
        
     },
     createName:(item,path,list,type,attr,id,media)=>{
        let ol = document.querySelector(list);
        let img = document.createElement('img');
        let li = document.createElement('li');
        img.alt="profile";
        if(item[path] == null){
            img.src="user.svg";
            img.height="276";
            img.width="185";
        }else{
            img.src = app.baseImg + imgSizes.profile_sizes[1] + item[path];
        }
        li.setAttribute("href","#");
        li.setAttribute("data-href",attr);
        li.setAttribute("id",id);
        li.setAttribute("media-type",media);
        let p = document.createElement('p');
        
        p.textContent= item[type];
        ol.appendChild(li);
        li.insertAdjacentElement('afterbegin',img);
        li.insertAdjacentElement('afterbegin',p);
    },

    replaceName:(item,index,links,path,list,type,attr,id,media,para)=>{
        if(index < links.length) {
            
            let li= links[index];
            li.setAttribute("id",id);
            li.setAttribute("media-type",media);
            if(para == "id"){
                li.setAttribute(para,id);
                console.log(id);
            }else if(para == 'media-type'){
                li.setAttribute(para,media); 
            }
            let pOld = li.querySelector('p');
            let imgOld = li.querySelector('img');                
            let img = document.createElement('img');
            let p = document.createElement('p');
            img.alt="profile";
            if(item[path] == null){
                img.src="user.svg";
                img.height="276";
                img.width="185";
            }else{
                img.src = app.baseImg + imgSizes.profile_sizes[1] + item[path];
            }
            p.textContent= item[type];
            li.replaceChild(p,pOld);
            li.replaceChild(img,imgOld);
            
        }else if(index >= links.length){
            app.createName(item,path,list,type,attr,id,media);
        }   
    }
     
 }

document.addEventListener('DOMContentLoaded',app.init);