import styles from "./Counter.module.scss";
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

const Counter = () => {
  const { isConnected } = useAccount();
  const [count, setCount] = useState(0);
  const [incrementValue, setIncrementValue] = useState(0);
  const [decrementValue, setDecrementValue] = useState(0);
  const [customError, setError] = useState("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: currentCount, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI_COUNTER,
    functionName: "count",
  });

  const { writeContractAsync } = useWriteContract({
    config,
  });

  const {
    data: txReceipt,
    isSuccess,
    isError,
  } = useWaitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  });

  async function incrementContract() {
    try {
      setIsLoading(true);
      const txHash = await writeContractAsync({
        functionName: "increment",
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
      });
      setTransactionHash(txHash.startsWith("0x") ? txHash : `0x${txHash}`);
      setError("");
    } catch (error) {
      setError("Error during increment");
      setIsLoading(false);
    }
  }

  async function decrementContract() {
    if (currentCount === undefined) return;
    const decrementResult = Number(currentCount) - 1;

    if (decrementResult < 0) {
      setError("Counter cannot be negative");
      return;
    }

    try {
      setIsLoading(true);
      await writeContractAsync({
        functionName: "decrement",
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
      });
      setError("");
    } catch (error) {
      setIsLoading(false);
      setError("Error during decrement");
    }
  }

  async function resetContract() {
    try {
      setIsLoading(true);
      await writeContractAsync({
        functionName: "reset",
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
      });
      setError("");
    } catch (error) {
      setIsLoading(false);
      setError("Error during reset");
    }
  }

  async function incrementByContract() {
    if (incrementValue > 0) {
      try {
        setIsLoading(true);
        await writeContractAsync({
          functionName: "incrementBy",
          abi: ABI_COUNTER,
          address: CONTRACT_ADDRESS,
          args: [BigInt(incrementValue)],
        });
        setError("");
      } catch (error) {
        setIsLoading(false);
        setError("Error during incrementBy");
      }
    }
  }

  async function decrementByContract() {
    if (decrementValue > 0) {
      try {
        setIsLoading(true);
        await writeContractAsync({
          functionName: "decrementBy",
          abi: ABI_COUNTER,
          address: CONTRACT_ADDRESS,
          args: [BigInt(decrementValue)],
        });
        setError("");
      } catch (error) {
        setIsLoading(false);
        setError("Error during decrementBy");
      }
    }
  }

  useEffect(() => {
    if (currentCount) {
      setCount(Number(currentCount));
    }
  }, [currentCount]);

  useEffect(() => {
    if (transactionHash) {
      if (isSuccess && txReceipt) {
        refetch();
        setTransactionHash("");
        setIsLoading(false);
      } else if (isError) {
        setTransactionHash("");
        setIsLoading(false);
      }
    }
  }, [isSuccess, txReceipt, transactionHash, refetch]);

  const handleIncrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (Number.isInteger(value)) {
      setIncrementValue(value);
    }
  };

  const handleDecrementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (Number.isInteger(value)) {
      setDecrementValue(value);
    }
  };

  return (
    <div>
      {isConnected ? (
        <>
          <div className={styles.CounterContainer}>
            <h3>Current Counter Value: {count}</h3>
            {customError && <p style={{ color: "red" }}>{customError}</p>}
            {isLoading && <p>Loading...</p>}
            <div className={styles.InteractionContainer}>
              <button
                disabled={isLoading}
                className={`${styles.ActionContainer} ${isLoading ? styles.disabled : ""}`}
                onClick={incrementContract}
              >
                <img src={addIcon} alt="Incrémenter" />
                <p>Increment</p>
              </button>
              <button
                disabled={isLoading}
                className={`${styles.ActionContainer} ${isLoading ? styles.disabled : ""}`}
                onClick={decrementContract}
              >
                <img src={minusIcon} alt="Décrementer" />
                <p>Decrement</p>
              </button>
              <button
                disabled={isLoading}
                className={`${styles.ActionContainer} ${isLoading ? styles.disabled : ""}`}
                onClick={resetContract}
              >
                <img src={resetIcon} alt="Reset" />
                <p>Reset</p>
              </button>

              <div
                className={`${styles.ActionContainer} ${isLoading ? styles.disabled : ""}`}
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
                className={`${styles.ActionContainer} ${isLoading ? styles.disabled : ""}`}
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
        </>
      ) : (
        <h3>Please connect your wallet</h3>
      )}
    </div>
  );
};

export default Counter;
