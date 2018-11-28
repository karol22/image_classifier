import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import Clarifai from 'clarifai'

const app = new Clarifai.App({
 apiKey: ''
});

const particlesOptions={
  particles: {
    number:{
      value:30,
      density:{
        enable:true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
        money: 0.00
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: 0,
        joined: data.joined,
      }
    });
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width -(clarifaiFace.right_col * width),
      bottomRow: height -(clarifaiFace.bottom_row * height),
    }
  }
  displayBox = (box) => {
    this.setState({box: box});
  }
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {

    this.setState({imageURL: this.state.input});
    app.models.initModel({id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40"})
      .then(generalModel => {
        return generalModel.predict(this.state.input);
      })
      .then(response => {
        var concepts = response['outputs'][0]['data']['concepts']
        console.log(concepts)
      })
      .catch(err => console.log(err)
    )
  }
  onRouteChange = (route) =>{
      if(route==='signin' || route==='register'){
        this.setState({isSignedIn: false});
      }else if(route==='home'){
        this.setState({isSignedIn: true});
      }
      this.setState({route: route});
  }
  render() {
    const {isSignedIn, imageURL, route, box, } =this.state;
    return (
      <div className="App">
      <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        <legend className="f1 fw6 ph0 mh0">ReciCash</legend>
        {
          route === 'signin' ?
            <Signin onRouteChange={this.onRouteChange}/>
          :(route === 'register' ?
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          :
            <div>
              <Logo/>
              <Rank/>
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageURL={imageURL}/>
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
