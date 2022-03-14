import { useEffect, useState } from "react";
import {
  VStack,
  useDisclosure,
  Button,
  Text,
  HStack,
  Select,
  Input,
  Box
} from "@chakra-ui/react";
import SelectWalletModal from "./Modal";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { networkParams } from "./networks";
import { toHex, truncateAddress } from "./utils";
import { useConnect, useAccount, useNetwork, useSignMessage } from "wagmi";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data: connectData }] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data: networkData }, switchNetwork] = useNetwork();
  const [message, setMessage] = useState("");
  const [{ data: signData }, signMessage] = useSignMessage({
    message
  });

  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  return (
    <>
      <Text position="absolute" top={0} right="15px">
        If you're in the sandbox, first "Open in New Window" ⬆️
      </Text>
      <VStack justifyContent="center" alignItems="center" h="100vh">
        <HStack marginBottom="10px">
          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
          >
            Let's connect with
          </Text>
          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
            sx={{
              background: "linear-gradient(90deg, #1652f0 0%, #b9cbfb 70.35%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Wagmi
          </Text>
        </HStack>
        <HStack>
          {!connectData.connected ? (
            <Button onClick={onOpen}>Connect Wallet</Button>
          ) : (
            <Button onClick={disconnect}>Disconnect</Button>
          )}
        </HStack>
        <VStack justifyContent="center" alignItems="center" padding="10px 0">
          <HStack>
            <Text>{`Connection Status: `}</Text>
            {connectData.connected ? (
              <CheckCircleIcon color="green" />
            ) : (
              <WarningIcon color="#cd5700" />
            )}
          </HStack>

          {!accountData ? (
            <Text>Account: No Account</Text>
          ) : (
            <Tooltip label={accountData.address} placement="right">
              <Text>{`Account: ${truncateAddress(accountData.address)}`}</Text>
            </Tooltip>
          )}
          <Text>{`Network ID: ${
            networkData.chain ? networkData.chain.id : "No Network"
          }`}</Text>
        </VStack>
        {connectData.connected && (
          <HStack justifyContent="flex-start" alignItems="flex-start">
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
              <VStack>
                <Button
                  onClick={() => switchNetwork(network)}
                  isDisabled={!network}
                >
                  Switch Network
                </Button>
                <Select placeholder="Select network" onChange={handleNetwork}>
                  <option value="3">Ropsten</option>
                  <option value="4">Rinkeby</option>
                  <option value="42">Kovan</option>
                  {/* <option value="1666600000">Harmony</option> */}
                  {/* <option value="42220">Celo</option> */}
                </Select>
              </VStack>
            </Box>
            <Box
              maxW="sm"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="10px"
            >
              <VStack>
                <Button
                  onClick={async () => await signMessage()}
                  isDisabled={!message}
                >
                  Sign Message
                </Button>
                <Input
                  placeholder="Set Message"
                  maxLength={20}
                  onChange={handleInput}
                  w="140px"
                />
                {signData ? (
                  <Tooltip label={signData} placement="bottom">
                    <Text>{`Signature: ${truncateAddress(signData)}`}</Text>
                  </Tooltip>
                ) : null}
              </VStack>
            </Box>
          </HStack>
        )}
        <Text>{error ? error.message : null}</Text>
      </VStack>
      <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
}
