export default function WhenDoMarketsOpen(props) {
    var days = 6//props.time.getDay();
    var hours = 17//props.time.getHours();
    var minutes = 38//props.time.getMinutes();
    var seconds = 50//props.time.getSeconds();
  
    seconds = 60 - seconds;
    minutes = 30 - minutes;
    hours = 8 - hours;
  
  
    //6:17:38:50
    //1:8:30:00
    //1:14:52:10
  
    return (
      <div class="countdown">Markets open in: 24hrs</div>
    )
  }