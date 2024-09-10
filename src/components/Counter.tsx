import styles from "../styles/Counter.module.scss";
import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ABI_COUNTER, CONTRACT_ADDRESS } from "../contract";
import { config } from "../wagmi";
import addIcon from "../assets/icons/add.svg";
import minusIcon from "../assets/icons/minus.svg";
import resetIcon from "../assets/icons/reset.svg";

enum CounterFunction {
  Increment = "increment",
  Decrement = "decrement",
  Reset = "reset",
  IncrementBy = "incrementBy",
  DecrementBy = "decrementBy",
}

const Counter = () => {
  const { isConnected } = useAccount();
  const [count, setCount] = useState(0);
  const [incrementValue, setIncrementValue] = useState(0);
  const [decrementValue, setDecrementValue] = useState(0);
  const [customError, setCustomError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");

  const { data: currentCount, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI_COUNTER,
    functionName: "count",
  });

  const { writeContractAsync } = useWriteContract({ config });

  const {
    data: txReceipt,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  });

  useEffect(() => {
    if (currentCount) {
      setCount(Number(currentCount));
    }
  }, [currentCount]);

  useEffect(() => {
    if (transactionHash) {
      if (isSuccess && txReceipt) {
        refetch();
        resetTransactionState();
      } else if (isError) {
        resetTransactionState();
        setCustomError("Transaction failed");
      }
    }
  }, [isSuccess, txReceipt, transactionHash, isError, refetch]);

  const resetTransactionState = () => {
    setTransactionHash("");
    setIsLoading(false);
  };

  const handleTransaction = async (
    functionName: CounterFunction,
    args?: number
  ) => {
    try {
      setIsLoading(true);
      const txHash = await writeContractAsync({
        functionName,
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
        args: args !== undefined ? [BigInt(args)] : [],
      });
      setTransactionHash(txHash.startsWith("0x") ? txHash : `0x${txHash}`);
      setCustomError("");
    } catch (error) {
      setCustomError(`Error during ${functionName}`);
      resetTransactionState();
    }
  };

  const incrementContract = () => handleTransaction(CounterFunction.Increment);
  const decrementContract = () => {
    if (count > 0) handleTransaction(CounterFunction.Decrement);
    else setCustomError("Counter cannot be negative");
  };
  const resetContract = () => handleTransaction(CounterFunction.Reset);
  const incrementByContract = () => {
    if (incrementValue > 0)
      handleTransaction(CounterFunction.IncrementBy, incrementValue);
  };
  const decrementByContract = () => {
    if (decrementValue > 0)
      handleTransaction(CounterFunction.DecrementBy, decrementValue);
  };

  const handleIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncrementValue(Number(e.target.value));
  };

  const handleDecrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecrementValue(Number(e.target.value));
  };

  return (
    <div>
      {isConnected ? (
        <div className={styles.counterContainer}>
          <h3>Current Counter Value: {count}</h3>
          {customError && <p style={{ color: "red" }}>{customError}</p>}
          {isLoading && <p>Loading...</p>}
          <div className={styles.interactionContainer}>
            <button
              disabled={isLoading}
              className={`${styles.actionContainer} ${isLoading ? styles.disabled : ""}`}
              onClick={incrementContract}
            >
              <img src={addIcon} alt="Incrémenter" />
              <p>Increment</p>
            </button>
            <button
              disabled={isLoading}
              className={`${styles.actionContainer} ${isLoading ? styles.disabled : ""}`}
              onClick={decrementContract}
            >
              <img src={minusIcon} alt="Décrementer" />
              <p>Decrement</p>
            </button>
            <button
              disabled={isLoading}
              className={`${styles.actionContainer} ${isLoading ? styles.disabled : ""}`}
              onClick={resetContract}
            >
              <img src={resetIcon} alt="Reset" />
              <p>Reset</p>
            </button>

            <div
              className={`${styles.actionContainer} ${isLoading ? styles.disabled : ""}`}
            >
              <input
                type="number"
                value={incrementValue}
                onChange={handleIncrementChange}
                placeholder="Enter increment value"
              />
              <button disabled={isLoading} onClick={incrementByContract}>
                Increment By
              </button>
            </div>
            <div
              className={`${styles.actionContainer} ${isLoading ? styles.disabled : ""}`}
            >
              <input
                type="number"
                value={decrementValue}
                onChange={handleDecrementChange}
                placeholder="Enter decrement value"
              />
              <button disabled={isLoading} onClick={decrementByContract}>
                Decrement By
              </button>
            </div>
          </div>
        </div>
      ) : (
        <h3>Please connect your wallet</h3>
      )}
    </div>
  );
};

export default Counter;
