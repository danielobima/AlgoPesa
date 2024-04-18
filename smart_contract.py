#import required libraries and modules

#import the algosdk module for development
import algosdk

#import the utils module that abstract more complex functions
from algokit_utils import (
    Account,
    EnsureBalanceParameters,
    EnsureFundedResponse,
    TestNetDispenserApiClient,
    TransferAssetParameters,
    TransferParameters,
    transfer,
)
from algosdk.util import algos_to_microalgos
from algosdk.account import address_from_private_key
from algosdk.mnemonic import from_private_key, to_private_key

from algosdk.kmd import KMDClient
from algosdk.v2client.algod import AlgodClient

#function to get account from mnemonic(25 word phrase for private key)
def get_account_from_mnemonic(mnemonic: str) -> Account:
    private_key = to_private_key(mnemonic)  # type: ignore[no-untyped-call]
    address = address_from_private_key(private_key)  # type: ignore[no-untyped-call]
    return Account(private_key=private_key, address=address)

#function to get account info (details) from private key
def account_info(algod_client: "AlgodClient", account_address: str) -> None:
    account_info = algod_client.account_info(account_address)
    return account_info

#function to transfer algo from one account to another
def transfer_algo(algod_client: "AlgodClient", to_account_address : str) -> None:
    #create a str: object that hold the mnemonic for the default sender account
    phrase = (
        "dose utility hurt luxury unit column trumpet quick property rate machine basket sustain sound better ketchup camera broken verify small airport reture relax abstract solution"
    )
    
    #call the get_account_from_mnemonic function to get the account address from the private key
    from_account_address = get_account_from_mnemonic(phrase)
    requested_amount = 50000000
    transfer(
        algod_client,
        TransferParameters(
            from_account=from_account_address,
            to_address=to_account_address,
            micro_algos=requested_amount,
        ),
    )

    account_info = algod_client.account_info(to_account_address)
    assert isinstance(account_info, dict)

#start algodclient
algod_client = AlgodClient("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "http://localhost:4001")

print(account_info(algod_client, "YQAJ6QUUR6QDLUIBIOQ6LOIDCTHBYGGHOVTEVS6MTAREAJTLQBGPETAVA4"))
