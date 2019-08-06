import React, { useState, ChangeEvent } from "react";
import {
  DebouncedSuggestionsService,
  WalletSuggestionAction,
  WALLET_SUGGESTION_ALL_ACTIONS,
  SuggestionsService
} from "@universal-login/commons";
import UniversalLoginSDK from "@universal-login/sdk";
import { Input } from "../commons/Input";
import { Suggestions } from "./Suggestions";
import { renderBusyIndicator } from "./BusyIndicator";
import { getStyleForTopLevelComponent } from "../../core/utils/getStyleForTopLevelComponent";
import Logo from "./../assets/logo.svg";
import "./../styles/walletSelector.css";
import "./../styles/walletSelectorDefaults.css";

interface WalletSelector {
  onCreateClick: (...args: any[]) => void;
  onConnectClick: (...args: any[]) => void;
  onDetectClick: () => void;
  sdk: UniversalLoginSDK;
  domains: string[];
  actions?: WalletSuggestionAction[];
  className?: string;
}

export const WalletSelector = ({
  onCreateClick,
  onConnectClick,
  onDetectClick,
  sdk,
  domains,
  actions = WALLET_SUGGESTION_ALL_ACTIONS,
  className
}: WalletSelector) => {
  const [debouncedSuggestionsService] = useState(
    new DebouncedSuggestionsService(
      new SuggestionsService(sdk, domains, actions)
    )
  );
  const [busy, setBusy] = useState(false);
  const [connections, setConnections] = useState<string[]>([]);
  const [creations, setCreations] = useState<string[]>([]);
  const [, setName] = useState("");
  const [accountStatus, setAccountStatus] = useState("show-initial");
  const [ethAccount, setEthAccount] = useState("");

  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setName(name);
    setBusy(true);
    debouncedSuggestionsService.getSuggestions(name, suggestions => {
      setConnections(suggestions.connections);
      setCreations(suggestions.creations);
      setBusy(false);
    });
  };

  const onDetectClick = async () => {
    if (!!window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        setEthAccount(ethereum.selectedAddress);
        setAccountStatus("show-account");
      } catch (error) {
        // User denied account access...
        setEthAccount("User denied ");
        setAccountStatus("show-picker");
      }
    } else {
      // No web3 browser found
      setEthAccount("No web3");
      setAccountStatus("show-picker");
    }
  };

  const renderSuggestions = () =>
    !busy && (connections.length || creations.length) ? (
      <Suggestions
        connections={connections}
        creations={creations}
        onCreateClick={onCreateClick}
        onConnectClick={onConnectClick}
        actions={actions}
      />
    ) : null;

  return (
    <div className={accountStatus}>
      <div className={"outter " + getStyleForTopLevelComponent(className)}>
        <button className="button-web3-provider" onClick={onDetectClick}>
          Sign in with Ethereum
        </button>
        <div className="ethereum-account">{ethAccount}</div>
        <div className="selector-input-wrapper">
          <img
            src={Logo}
            alt="Universal login logo"
            className="selector-input-img"
          />
          <Input
            className="wallet-selector"
            id="loginInput"
            onChange={(event: ChangeEvent<HTMLInputElement>) => update(event)}
            placeholder="type a username"
            autocomplete="off"
            autoFocus
          />
          {renderBusyIndicator(busy)}
        </div>
        {renderSuggestions()}
      </div>
    </div>
  );
};
