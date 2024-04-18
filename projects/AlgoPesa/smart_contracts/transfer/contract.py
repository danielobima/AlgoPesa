from algopy import ARC4Contract, arc4, itxn, Account


class Transfer(ARC4Contract):
    @arc4.abimethod()
    def transaction(self, addr: Account, amount: arc4.UInt64 ) -> arc4.String:

        trx = itxn.Payment(
            amount=amount.native,
            fee=1000,
            receiver=addr,
        ).submit()

        
        return arc4.String("success")
