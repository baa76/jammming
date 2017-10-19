import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: ''};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }
  //In SearchBar.js, create a method called search that passes the state of the term to this.props.onSearch
  search() {
    this.props.onSearch(this.state.term)
  }
  /* 71. In SearchBar.js create a method called handleTermChange with the following functionality:
   Accepts an event argument
  Sets the state of the search bar's term to the event target's value.*/
  handleTermChange(event) {
    this.setState({term: event.target.value})
  }

  onKeyPress(event) {
               if(event.key === 'Enter') {
                  this.props.onSearch(this.state.term)
               }
           }

  render () {
       return (
                <div className="SearchBar">
                  <input placeholder="Enter A Song, Album, or Artist" onChange={ this.handleTermChange } onKeyPress={ this.onKeyPress }/>
                  <a onClick={ this.search }>SEARCH</a>
                </div>
              )
            }
          };

export default SearchBar;
