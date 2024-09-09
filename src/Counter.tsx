import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ABI_COUNTER, CONTRACT_ADDRESS } from "./contract";
import { config } from "./wagmi";

const Counter = () => {
  const { isConnected } = useAccount();
  const [count, setCount] = useState(0);
  const [incrementValue, setIncrementValue] = useState(0);
  const [decrementValue, setDecrementValue] = useState(0);

  const { data: currentCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI_COUNTER,
    functionName: "count",
  });

  const { writeContractAsync, error } = useWriteContract({
    config,
  });

  console.log(error);

  async function incrementContract() {
    try {
      await writeContractAsync({
        functionName: "increment",
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
      });
    } catch (error) {
      console.error("Error during increment:", error);
    }
  }

  async function decrementContract() {
    try {
      await writeContractAsync({
        functionName: "decrement",
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
      });
    } catch (error) {
      console.error("Error during decrement:", error);
    }
  }

  async function resetContract() {
    try {
      await writeContractAsync({
        functionName: "reset",
        abi: ABI_COUNTER,
        address: CONTRACT_ADDRESS,
      });
    } catch (error) {
      console.error("Error during reset:", error);
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
      } catch (error) {
        console.error("Error during incrementBy:", error);
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
      } catch (error) {
        console.error("Error during decrementBy:", error);
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
          <h2>Current Counter Value: {count}</h2>
          <button onClick={incrementContract}>Increment</button>
          <button onClick={decrementContract}>Decrement</button>
          <button onClick={resetContract}>Reset</button>

          <input
            type="number"
            value={incrementValue}
            onChange={handleIncrementChange}
            placeholder="Enter increment value"
          />
          <button onClick={incrementByContract}>Increment By</button>

          <input
            type="number"
            value={decrementValue}
            onChange={handleDecrementChange}
            placeholder="Enter decrement value"
          />
          <button onClick={decrementByContract}>Decrement By</button>
        </>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};

export default Counter;
