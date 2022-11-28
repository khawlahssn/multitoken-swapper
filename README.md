# Multi-token Swapper

User can perform a swapping operation described as `ELR || GAU <==> FRM` where `ELR`, `GAU`, and `FRM` are arbitray names given to the tokens.

## Contracts deployed:
- Fermat Token ("FRM"). [Polygonscan 🔎](https://mumbai.polygonscan.com/address/0xd0bd41a648Eda8Eac90ddF6B9b1E4B1851164b8E#code) 
- Euler Token ("ELR"). [Polygonscan 🔎](https://mumbai.polygonscan.com/address/0xe51b7483c9be81797505Fdb003fC4e7C45f9ef77#code) 
- Gauss Token ("GAU"). [Polygonscan 🔎](https://mumbai.polygonscan.com/address/0x91CC1FA9A2fc82Ef81b4AafefAF27B616Cf46D74#code) 
- Swapper. [Polygonscan 🔎](https://mumbai.polygonscan.com/address/0x33D13222157BC6b8Ad5fF27f18AecA1f53c746e1#code)

## Instructions:
1. `FermatToken.sol` assigns a **minter** role to `Swapper.sol` contract via `init()` that takes the address of the `Swapper.sol` contract
2. An initial supply of `FRM` tokens can be minted by the owner via `mintFRM()` in the `Swapper.sol` contract after passing the address of `FermatToken.sol` to the `constructor()`
3. Assign an allowance to the `Swapper.sol` of `1000000 * 10 ** 18` from each token contract (that is, `EulerToken.sol` & `GaussToken.sol`)
4. Provide an initial liquidity to the swapper of `1000000 * 10 ** 18` via `init()` that takes in the address for each token `ELR` & `GAU`
5. Now you're ready to swap! this part is important. you'll pass the address of the token you want to swap for `FRM` and the amount of the token (`ELR` or `GAU`) you're trading in exchange for it
6. Un-swapping also takes in the same parameters as `swap()` described in **step 5**
7. As an admin, you can set a new price for `FRM` via `setPriceFRM()` (pass a value without adding decimals)
8. Finally, to view the current price of `FRM`, you'll simply call `getPriceFRM()`