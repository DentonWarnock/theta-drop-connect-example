import React from "react";
import { ThetaDropConnect } from "@thetalabs/theta-drop-connect";
import "./App.css";
import logo from "./img/TigonsLogo.PNG";
import title from "./img/TigonsWelcomeTitle.PNG";

const AppId = "dapp_8gsf5446h44rsrpyun0pu5qqztm";
const redirectURL = "http://localhost:3000/thetadrop-auth-finished.html";

const ThetaZillaMarketplaceUrl =
  "https://thetazilla.thetadrop.com/content/type_2s2kcznsu3e06en43r3kg50b90c";
const ThetaZillaId = "type_2s2kcznsu3e06en43r3kg50b90c";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.thetaDrop = new ThetaDropConnect();

    this.state = {
      isOwner: false,
    };
  }

  componentDidMount() {
    // Optional: Use only if using the redirect option
    this.finishConnectViaRedirect();
  }

  finishConnectViaRedirect = async () => {
    const result = await this.thetaDrop.finishConnectViaRedirect();

    if (result) {
      const { snsId, oauth2Token } = result;

      this.setState({
        tpsId: snsId,
        authToken: oauth2Token,
      });

      this.refreshUser();
      this.refreshOwnershipChecks();
    }
  };

  refreshOwnershipChecks = async () => {
    const filters = {
      content_id: ThetaZillaId,
    };
    await this.thetaDrop.fetchUserNFTs(filters);

    const isOwner = await this.thetaDrop.checkUserIsOwner(filters);

    this.setState({
      isOwner: isOwner,
    });
  };

  refreshUser = async () => {
    const userData = await this.thetaDrop.fetchUser();

    this.setState({
      userData: userData,
    });
  };

  connectToThetaDrop = async () => {
    const { snsId, oauth2Token } = await this.thetaDrop.connectViaPopup(
      AppId,
      redirectURL
    );

    this.setState({
      tpsId: snsId,
      authToken: oauth2Token,
    });

    this.refreshUser();
    this.refreshOwnershipChecks();
  };

  connectToThetaDropViaRedirect = async () => {
    const hostUri = "http://localhost:3000";
    this.thetaDrop.connectViaRedirect(AppId, hostUri);
  };

  render() {
    const { userData, isOwner } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          {/* <h2>Order of the Tigons</h2> */}
          <img src={logo} alt="Logo" />
          <img src={title} alt="Logo" />
          <p>
            A Tigon is your ticket into the Order of the Tigons (OOTT) - a
            membership-only community which includes ongoing airdrops to owners,
            an exclusive shop and much much more.
          </p>

          {userData && (
            <div>
              <div style={{ marginBottom: 12 }}>Logged in as:</div>
              <img src={userData.avatar_url} style={{ width: 100 }} />
              <div style={{ fontSize: 12 }}>{userData.display_name}</div>
              <div style={{ fontSize: 10 }}>{`@${userData.username}`}</div>
            </div>
          )}

          {userData === undefined && (
            <div>
              <button onClick={this.connectToThetaDrop}>
                Prove Tigon Ownership via ThetaDrop Popup
              </button>
              <button onClick={this.connectToThetaDropViaRedirect}>
                Prove Tigon Ownership via ThetaDrop Redirect
              </button>
            </div>
          )}

          {userData !== undefined && !isOwner && (
            <div>
              <h3>Sorry...Owners Only Area</h3>
              <a href={ThetaZillaMarketplaceUrl} target={"_blank"}>
                Buy a ThetaZilla
              </a>
            </div>
          )}

          {isOwner && (
            <div>
              <h3>Owners Only Area</h3>
              <button
                onClick={() => {
                  alert("Hello Tigon Owner - Welcome to the Sanctuary :)");
                }}
              >
                Owners Only Lounge
              </button>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
