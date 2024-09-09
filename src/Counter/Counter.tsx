import styles from "./Counter.module.scss";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ABI_COUNTER, CONTRACT_ADDRESS } from "../contract";
import { config } from "../wagmi";
import addIcon from "../assets/icons/add.svg";
import minusIcon from "../assets/icons/minus.svg";
import resetIcon from "../assets/icons/minus.svg";

const Counter = () => {
  const { isConnected } = useAccount();
  const [count, setCount] = useState(0);
  const [incrementValue, setIncrementValue] = useState(0);
  const [decrementValue, setDecrementValue] = useState(0);
  const [customError, setError] = useState("");

  const { data: currentCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI_COUNTER,
    functionName: "count",
  });

  const { writeContractAsync } = useWriteContract({
    config,
  });

  async function incrementContract() {
    try {
      await writeContractAsync({
        functionName: "increment",
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
      });
      setError("");
    } catch (error) {
      console.error("Error during increment:", error);
      setError("Error during increment");
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
      await writeContractAsync({
        functionName: "decrement",
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
      });
      setError("");
    } catch (error) {
      console.error("Error during decrement:", error);
      setError("Error during decrement");
    }
  }

  async function resetContract() {
    try {
      await writeContractAsync({
        functionName: "reset",
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
      });
      setError("");
    } catch (error) {
      console.error("Error during reset:", error);
      setError("Error during reset");
    }
  }

  async function incrementByContract() {
    if (incrementValue > 0) {
      try {
        await writeContractAsync({
          functionName: "incrementBy",
          abi: ABI_COUNTER,
          address: CONTRACT_ADDRESS,
          args: [BigInt(incrementValue)],
        });
        setError("");
      } catch (error) {
        console.error("Error during incrementBy:", error);
        setError("Error during incrementBy");
      }
    }
  }

  async function decrementByContract() {
    if (decrementValue > 0) {
      try {
        await writeContractAsync({
          functionName: "decrementBy",
          abi: ABI_COUNTER,
          address: CONTRACT_ADDRESS,
          args: [BigInt(decrementValue)],
        });
        setError("");
      } catch (error) {
        console.error("Error during decrementBy:", error);
        setError("Error during decrementBy");
      }
    }
  }

  useEffect(() => {
    if (currentCount) {
      setCount(Number(currentCount));
    }
  }, [currentCount]);

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
            <div className={styles.InteractionContainer}>
              <div className={styles.ActionContainer}>
                <img
                  onClick={incrementContract}
                  src={addIcon}
                  alt="Incrémenter"
                />
                <p>Increment</p>
              </div>
              <div className={styles.ActionContainer}>
                <img
                  onClick={decrementContract}
                  src={minusIcon}
                  alt="Décrementer"
                />
                <p>Decrement</p>
              </div>
              <div className={styles.ActionContainer}>
                <img onClick={resetContract} src={resetIcon} alt="Reset" />
                <p>Reset</p>
              </div>
              <div className={styles.ActionContainer}>
                <input
                  type="number"
                  value={incrementValue}
                  onChange={handleIncrementChange}
                  placeholder="Enter increment value"
                />
                <button onClick={incrementByContract}>Increment By</button>
              </div>

              <div className={styles.ActionContainer}>
                <input
                  type="number"
                  value={decrementValue}
                  onChange={handleDecrementChange}
                  placeholder="Enter decrement value"
                />
                <button onClick={decrementByContract}>Decrement By</button>
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
