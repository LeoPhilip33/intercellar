import { useConnect } from "wagmi";
import { useConnection } from "../utils/ConnectionProvider";
import styles from "../styles/Header.module.scss";

const Header = () => {
  const { disconnect, address, isConnected } = useConnection();
  const { connectors, connect, error } = useConnect();

  return (
    <div className={styles.headerContainer}>
      {address ? `Connected: ${address}` : "Not connected"}

      {isConnected && (
        <button type="button" onClick={disconnect}>
          Disconnect
        </button>
      )}
      {!isConnected && (
        <>
          {connectors.map((connector) => (
            <div key={connector.uid}>
              <button onClick={() => connect({ connector })} type="button">
                {connector.name}
              </button>
            </div>
          ))}
          {error && <div>{error.message}</div>}
        </>
      )}
    </div>
  );
};

export default Header;
