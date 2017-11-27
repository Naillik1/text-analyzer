import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Form from './Form.js';
import Chart from './Chart.js';
import './App.css';

class App extends Component {
  state = { 
    watsonData: [],
    errors: {}
  };

  analyzeText = (event) => {
    event.preventDefault();
    const payload = { data: document.forms.toAnalyze.resume.value };
    fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
      .then(res => {
        if (res.errors) {
          this.setState({ errors: res.errors })
        } else {
          this.setState({ watsonData: res, errors: {} });
        }
    });
  }

  render() {
    const margin = { top: 30, right: 20, bottom: 30, left: 150 };
    const width = 960 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
     
    let keywords = (this.state.watsonData.keywords)
    if (keywords) {
      keywords = keywords.map( (elem) => {
      elem['key'] = `${elem.text}${elem.relevance}`
      return elem;
      });
    }
    const barChart = keywords ? (
        <Chart data={keywords} margin={margin} width={width} height={height}/> 
        ) : null;
    return (
        <MuiThemeProvider>
          <div className='App'>
            <header className='App-header'>
              <h1 className='App-title'>Resume Analyzer</h1>
              <h3> Enter your resume + cover letter to see what Watson thinks the most relevant keywords are! </h3>
            </header>
            <Form onSubmit={this.analyzeText} errors={this.state.errors} />
            { barChart }
          </div>
        </MuiThemeProvider>
        );
  }

}
export default App;
