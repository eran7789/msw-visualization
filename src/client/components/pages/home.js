import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { fetchForecast } from 'actions/forecast.actions';

import SwellHeight from 'components/visualizations/swell-height';

class Home extends Component<> {
  static ssrApiActions = [];

  state = {
    spotId: ""
  }

  componentDidMount() {
    this.props.fetchForecast({ spotId: '3658' });
  }

  onInputchange = event => {
    this.setState({ spotId: event.target.value });
  }

  onFormSubmit = event => {
    event.preventDefault();
    this.props.fetchForecast({ spotId: this.state.spotId });
  }

  render() {
    const { forecast } = this.props;

    return (
      <div className="home">
        <form onSubmit={this.onFormSubmit}>
          <input 
            placeholder="enter spot id" 
            value={this.state.spotId} 
            onChange={this.onInputchange} />
          <button>get spot forecast</button>
        </form>
        <div>
          <SwellHeight />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  forecast: state.forecast.forecast
});

export default connect(mapStateToProps, {
  fetchForecast
})(Home);
