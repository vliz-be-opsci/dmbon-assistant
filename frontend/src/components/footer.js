import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery';
// import '.././css/index.css'

//add jquery functionality
$(document).ready(function() {
    var disappear = function(){
        return $(document).height() - $(window).height();
      };

    $(function(){
    $(window).scroll(function(){
        if($(this).scrollTop() >= disappear()){
                $('.vanish').fadeIn();
            }
            else{
                $('.vanish').fadeOut();
            }
        });
    });
    
});

var style = {
    backgroundColor: "pink",   //#F8F8F8
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
    display: "none"
}

var phantom = {
  display: 'block',
  padding: '20px',
  height: '60px',
  width: '100%',
}


function Footer() {

    return (
        <div>
            <div style={phantom} />
            <div style={style} class="vanish">
                Footer here with info about the app and vliz
            </div>
        </div>
    )
}

export default Footer