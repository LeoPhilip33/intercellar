import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ABI_COUNTER, CONTRACT_ADDRESS } from './contract';

const Counter = () => {
  const { isConnected } = useAccount();
  const [count, setCount] = useState(0);

  const { data: currentCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI_COUNTER,
    functionName: 'count',
  });

  const { data: hash, writeContract } = useWriteContract()
  
  async function incrementContract() {
    console.log('incrementing')
    writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI_COUNTER,
        functionName: 'increment',
      })
  }

  useEffect(() => {
    if (currentCount) {
      setCount(Number(currentCount));
    }
  }, [currentCount]);


  return (
    <div>
      {isConnected ? (
        <>
          <h2>Current Counter Value: {count}</h2>
          <button onClick={incrementContract}>Increment</button>
          <button>Decrement</button>
          <button>Reset</button>
        </>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};

export default Counter;
