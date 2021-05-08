import React from "react";
export default function Login()
{return (
    <div id="formContent">
        <div> Login Page</div>
        <div className="fadeIn first">
        </div>

        <form>
            <input type="text" id="login" className="fadeIn second" name="login" placeholder="Username" />
                <input type="text" id="password" className="fadeIn third" name="login" placeholder="Password" />
                    <input type="submit" className="fadeIn fourth" value="Log In" />
        </form>

        <div id="formFooter">
            <a className="underlineHover" href="#">Forgot Password?</a>
        </div>

    </div>
);

}