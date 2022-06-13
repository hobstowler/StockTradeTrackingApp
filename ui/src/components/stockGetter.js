class StockGetter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        stocks: []
      };
    }
  
    componentDidMount() {
      fetch('https://api.tdameritrade.com/v1/marketdata/SPY/quotes', {
        method: 'post',
        headers: new Headers({
          'Accept-Encoding': 'gzip',
          'Accept-Language': 'en-US',
          'Authorization': 'SPY'
        })
      });
    }
  }