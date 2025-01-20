import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const WalletConnectButton = () => {
  const { open } = useWeb3Modal();
  const { isConnecting, address } = useAccount();

  return (
    <Button
      onClick={() => open()}
      disabled={isConnecting}
      className="bg-betting-primary hover:bg-betting-primary/80"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : address ? (
        `${address.slice(0, 6)}...${address.slice(-4)}`
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
};