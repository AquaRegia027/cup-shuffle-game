'use client';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useGameState } from '@/hooks/useGameState';
import { useEffect } from 'react';
import { Button } from '@/components/shared/Button';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { updateProfile } = useGameState();

  useEffect(() => {
    if (address) {
      updateProfile({ walletAddress: address });
    }
  }, [address, updateProfile]);

  if (isConnected && address) {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cream-400 text-xs">Connected</p>
            <p className="text-cream-200 text-sm font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
          <Button
            label="Disconnect"
            variant="ghost"
            onClick={() => disconnect()}
            className="text-xs px-3 py-1.5"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="card space-y-3">
      <p className="text-cream-300 text-sm">Connect wallet for on-chain features</p>
      {connectors.slice(0, 3).map((connector) => (
        <Button
          key={connector.id}
          label={connector.name}
          variant="secondary"
          onClick={() => connect({ connector })}
          className="w-full"
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="12" height="9" rx="2" />
              <path d="M10 8.5a1 1 0 11-2 0 1 1 0 012 0z" fill="currentColor" />
            </svg>
          }
        />
      ))}
    </div>
  );
}
