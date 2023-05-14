import logo from "./logo.svg";
import "./App.css";

import {
  initializeAppCheck,
  getToken,
  ReCaptchaV3Provider,
} from "firebase/app-check";
import { initializeApp } from "firebase/app";

function App() {

  let appCheckTokenResponse = '';
  const reCaptchaV3SiteKet = "6LdFbAkmAAAAAAvz0nbcL99F_l4wzeCRz6K4AttP"
  // ********************************************************************************
  // ******************* Change your firebase configuration here. *******************
  const app = initializeApp({
    // apiKey: "XXXXXXXX",
    // authDomain: "XXXXXXXX",
    // projectId: "XXXXXXXX",
    // storageBucket: "XXXXXXXX",
    // messagingSenderId: "XXXXXXXX",
    // appId: "XXXXXXXX",
    // measurementId: "XXXXXXXX",
  });
  // ********************************************************************************
  // ********************************************************************************

  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(reCaptchaV3SiteKet),
    isTokenAutoRefreshEnabled: true,
  });

  const callApiWithAppCheckForGetToken = async () => {
    try {
      appCheckTokenResponse = await getToken(appCheck);
    } catch (err) {
      console.log("Error getToken => ", err);
      return;
    }
    
    console.log("appCheckTokenResponse TOKEN :: => ",JSON.stringify(appCheckTokenResponse, null, 4));
  };

  const verifyAppCheckToken = async () => {

    if (appCheckTokenResponse !== '') {
      const bearer = "Bearer "
      const response = await fetch("http://localhost:3001/authorization/appcheck", {
        method: "post",
        headers: {
          "Authorization": bearer.concat("", appCheckTokenResponse.token),
          "Content-Type": "application/json",
        },
      });
      const text = await response.json();
      console.log("response Verify AppCheck Token from API => ", JSON.stringify(text, null, 4));
    } else {
      console.log("Not Call API Verify AppCheck Token Because App Check Token Empty!");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <h3 style={{ margin: 0, color: '#fe9000'}}>F12 open inspect for Display AppCheck Token in side Console.</h3> 
        <br/> 
        <h4 style={{ margin: 0 }}>Generate AppCheck Token</h4>
        <button onClick={callApiWithAppCheckForGetToken}>
        Generate AppCheckToken
        </button>
        <hr/>
        <h4 style={{ margin: 0 }}>Verify AppCheck Token</h4>
        <button onClick={verifyAppCheckToken}>
          Verify AppCheckfToken
        </button>
      </header>
    </div>
  );
}

export default App;
