import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery';
import "../css/footer.css";
import {FaGithubSquare, FaLinkedin, FaMailBulk, FaTwitterSquare, FaFacebook, FaYoutube} from 'react-icons/fa';

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
    backgroundColor: "#6cb2c5",   //#F8F8F8
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "120px",
    width: "68.1%",
    display: "none",
    marginLeft: "16%"
}

var phantom = {
  display: 'block',
  padding: '20px',
  height: '80px'
}


function Footer() {

    return (
        <div>
            <div style={phantom} className="phantom"/>
            <div style={style} className="vanish socialbanner">
                <a href="https://github.com/vliz-be-opsci/" target="_blank"><FaGithubSquare class="socialitem"/></a>
                <a href="https://www.linkedin.com/company/vliz---flanders-marine-institute/mycompany/" target="_blank"><FaLinkedin class="socialitem"/></a>
                <a href="mailto:opsci@vliz.be" target="_blank"><FaMailBulk class="socialitem"/></a>
                <a href="https://twitter.com/VLIZnews" target="_blank"><FaTwitterSquare class="socialitem"/></a>
                <a href="https://www.facebook.com/pages/Vlaams-Instituut-voor-de-Zee/455354371162277" target="_blank"><FaFacebook class="socialitem"/></a>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank"><FaYoutube class="socialitem"/></a>
            </div>
        </div>
    )
}

export default Footer