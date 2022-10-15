import { BigNumberish, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useBalance } from "wagmi";

type BalanceProps = {
  address: string;
  price: number;
};

/**
 Display balance of an address
*/

export default function Balance({ address, price }: BalanceProps) {
  const [isEthBalance, setIsEthBalance] = useState(true);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  const {
    data: fetchedBalanceData,
    isError,
    isLoading,
  } = useBalance({
    addressOrName: address,
    watch: true,
    // TODO: a dynamic on local and other networks
    cacheTime: 5_000,
  });

  const onToggleBalance = () => {
    setIsEthBalance(!isEthBalance);
  };

  useEffect(() => {
    if (isEthBalance && fetchedBalanceData?.formatted) {
      setBalance(+Number(fetchedBalanceData?.formatted).toFixed(2));
    } else {
      if (fetchedBalanceData?.value) {
        setBalance(+ethers.utils.formatEther(fetchedBalanceData?.value.mul(price) as BigNumberish));
      }
    }
  }, [fetchedBalanceData, isEthBalance, price]);

  if (!address || isLoading || balance == undefined) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`border-2 border-gray-400 rounded-xl p-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning text-xs">Error</div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-gray-400 rounded-xl p-2 flex flex-col items-center max-w-fit cursor-pointer`}
      onClick={onToggleBalance}
    >
      {/* display  eth or dollar balance  */}
      <div className="w-full flex items-center justify-center">
        {isEthBalance ? (
          <>
            <span>{balance?.toFixed(2)}</span>
            <span className="text-xs font-bold m-1">ETH</span>
          </>
        ) : (
          <>
            <span className="text-xs font-bold m-1">$</span>
            <span>{balance?.toFixed(2)}</span>
          </>
        )}
      </div>
    </div>
  );
}