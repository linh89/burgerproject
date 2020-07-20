import React, { useState, useEffect } from 'react';
import './App.css';
import Movie from './components/Movie';


import { 
  Container, 
  Nav, 
  NavItem, 
  NavLink, 
  Button, 
  Row, 
  Popover, 
  PopoverHeader, 
  PopoverBody, 
  ListGroup, 
  ListGroupItem, 
  ListGroupItemText
} from 'reactstrap';

const App = (props) => {
  
  const [moviesCount, setMoviesCount] = useState(0);
  const [moviesWishList, setMoviesWishList] = useState([]);
  const [movieList, setMovieList] = useState([]);
  
  var handleClickAddMovie = async (name,img) => {
    setMoviesCount(moviesCount+1);
    setMoviesWishList([...moviesWishList, {name:name, img:img}]);
    
    const addMovie = await fetch('/wishlist-movie', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `name=${name}&img=${img}`
    });
  }
  
  var handleClickDeleteMovie = async (name) => {
    setMoviesCount(moviesCount-1);
    setMoviesWishList( moviesWishList.filter(obj => obj.name != name) );

    const deleMovie = await fetch(`/wishlist-movie/${name}`, {
    method: 'DELETE',
   });
  }

  var newWish = moviesWishList.map((movie, i) => {
    return (
      <ListGroupItem>
        <ListGroupItemText onClick={() => {handleClickDeleteMovie(movie.name)}}>
        <img width="25%" src={movie.img}/> {movie.name}
       
        </ListGroupItemText>
      </ListGroupItem>
    )
  })
  
  const [popoverOpen, setPopoverOpen] = useState(false);
  const toggle = () => setPopoverOpen(!popoverOpen);
  
  useEffect( () => {
    async function loadData() {
    	const response = await fetch('/new-movies');
      const responseJson = await response.json();
      setMovieList(responseJson.movies);

      const responseWish = await fetch('wishlist-movie');
      const responseWishJson = await responseWish.json();
      
      var whishListFromDb = responseWishJson.map(function (movie, i){
        return {name:movie.movieName,img:movie.movieImg}
      })
      
      setMoviesWishList(whishListFromDb)
      setMoviesCount(responseWishJson.movies.length)
    }
    loadData()
  }, []);

  var movieListData = movieList.map(function (movie, i) {
    var result = moviesWishList.find(element => element.name == movie.title);
    var isSee = false
    if(result != undefined){
    isSee = true
  }
  var resultDesc = movie.overview
  if(resultDesc.length > 80){
    resultDesc = resultDesc.slice(0,80)+'...'
  }
    return (<Movie key={i} movieSee={isSee} handleClickAddMovieParent={handleClickAddMovie} handleClickDeleteMovieParent={handleClickDeleteMovie} movieName={movie.title} movieDesc={resultDesc} movieImg={'https://image.tmdb.org/t/p/w500'+movie.backdrop_path} globalRating={movie.note} globalCountRating={movie.vote} />);
  })


  
  
  
  return (
    <div style={{backgroundColor: "#232528"}}>
      <Container>
      <Nav>
        <span className="navbar-brand">
          <img src="/img/logo.png" width="30" height="30" className="d-inline-block align-top" />
        </span>
        <NavItem>
          <NavLink style={{color: "white"}}>Last Releases</NavLink>
        </NavItem>
        <NavItem>
          <NavLink><Button id="Popover1" type="button" >{moviesCount} films</Button></NavLink>
          <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
            <PopoverHeader>WhishList</PopoverHeader>
            <PopoverBody>
              <ListGroup>
                
                  {newWish}
                  
              </ListGroup>
            </PopoverBody>
          </Popover>
        </NavItem>
       
      </Nav>
      
      <Row style={{marginBottom:50}}> 
        {movieListData}
      </Row>
        
    </Container>
    </div>
  );
}

export default App;
