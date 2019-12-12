// import styled from 'react-emotion'
// import React, {Component} from 'react'
// import {Authereum} from 'authereum'
// import Web3 from 'web3'
// import Button from '../Forms/Button'
// import {GlobalConsumer} from '../../GlobalState'
// import {WALLET_MODAL} from '../../modals'
// import mq from '../../mediaQuery'

// const logo = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 318.6 318.6" style="enable-background:new 0 0 318.6 318.6" xml:space="preserve"><style>.st0{fill:#E2761B;stroke:#E2761B;stroke-linecap:round;stroke-linejoin:round;} .st1{fill:#E4761B;stroke:#E4761B;stroke-linecap:round;stroke-linejoin:round;} .st2{fill:#D7C1B3;stroke:#D7C1B3;stroke-linecap:round;stroke-linejoin:round;} .st3{fill:#233447;stroke:#233447;stroke-linecap:round;stroke-linejoin:round;} .st4{fill:#CD6116;stroke:#CD6116;stroke-linecap:round;stroke-linejoin:round;} .st5{fill:#E4751F;stroke:#E4751F;stroke-linecap:round;stroke-linejoin:round;} .st6{fill:#F6851B;stroke:#F6851B;stroke-linecap:round;stroke-linejoin:round;} .st7{fill:#C0AD9E;stroke:#C0AD9E;stroke-linecap:round;stroke-linejoin:round;} .st8{fill:#161616;stroke:#161616;stroke-linecap:round;stroke-linejoin:round;} .st9{fill:#763D16;stroke:#763D16;stroke-linecap:round;stroke-linejoin:round;}</style><path class="st0" d="M274.1 35.5l-99.5 73.9L193 65.8z"/><path class="st1" d="M44.4 35.5l98.7 74.6-17.5-44.3zM238.3 206.8l-26.5 40.6 56.7 15.6 16.3-55.3zM33.9 207.7L50.1 263l56.7-15.6-26.5-40.6z"/><path class="st1" d="M103.6 138.2l-15.8 23.9 56.3 2.5-2-60.5zM214.9 138.2l-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zM177.9 230.9l33.9 16.5-4.7-39.3z"/><path class="st2" d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3zM106.8 247.4l31.5 14.9-.2-9.3 2.5-22.1z"/><path class="st3" d="M138.8 193.5l-28.2-8.3 19.9-9.1zM179.7 193.5l8.3-17.4 20 9.1z"/><path class="st4" d="M106.8 247.4l4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zM230.8 162.1l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zM110.6 185.2l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"/><g><path class="st5" d="M87.8 162.1l23.6 46-.8-22.9zM208.1 185.2l-1 22.9 23.7-46zM144.1 164.6l-5.3 28.9 6.6 34.1 1.5-44.9zM174.6 164.6l-2.7 18 1.2 45 6.7-34.1z"/></g><path class="st6" d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zM110.6 185.2l.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z"/><path class="st7" d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"/><path class="st8" d="M177.9 230.9l-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"/><g><path class="st9" d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"/></g><path class="st6" d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zM103.6 138.2l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zM174.6 164.6l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z"/></svg>`

// const WalletsContainer = styled('div')`
//   display: flex;
//   justify-content: center;
//   flex-direction: column;
//   align-items: center;
//   ${mq.medium`
//     flex-direction: row;
//   `}
// `
// const TitleContainer = styled('h3')`
//   text-align: center;
// `
// const LogoContainer = styled('div')`
//   display: flex;
//   flex-direction: column;
//   width: 85px;
//   height: 175px;
//   margin-bottom: 25px;
//   margin-right: 0px;
//   margin-left: 0px;
//   align-items: center;
//   ${mq.small`
//     width: 140px;
//     height: 140px;
//     margin-right: 10px;
//     margin-left: 10px;
//   `}
// `
// const LogoText = styled('div')`
//   font-size: 10px;
//   height: 25px;
//   text-align: center;
//   margin-bottom: 15px;
//   width: 100px;
//   ${mq.small`
//     margin-bottom: 10px;
//   `}
// `
// const AuthereumLogo = styled(AuthereumImage)`
//   max-height: 75px;
//   max-width: 75px;
//   height: 100px;
//   margin-bottom: 5px;
// `
// const ULLogo = styled(ULImage)`
//   max-height: 75px;
//   max-width: 75px;
//   height: 100px;
//   margin-bottom: 5px;
// `
// const MetaMaskLogo = styled(MetaMaskImage)`
//   max-height: 75px;
//   max-width: 75px;
//   height: 100px;
//   margin-bottom: 5px;
// `
// const WebThreeLogo = styled('img')`
//   max-height: 60px;
//   max-width: 60px;
//   margin-top: 10px;
//   margin-bottom: 10px;
//   ${mq.small`
//     max-height: 50px;
//     margin-bottom: 5px;
//     height: 100px;
//   `}
// `
// const LogoButton = styled(Button)`
//   width: 150px;
// `

// export default class WalletModal extends Component {
//   constructor() {
//     super()
//     this.state = {
//       isWeb3Injected: this.isWeb3()
//     }
//   }

//   sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms))
//   }

//   authereumInit = async (networkState, signIn) => {
//     window.sessionStorage.setItem('walletSelection', 'authereum')
//     if (!networkState.networkName) {
//       console.error('Network not defined')
//       return
//     }
//     const authereum = new Authereum(networkState.networkName.toLowerCase())
//     const provider = authereum.getProvider()
//     provider.enable()
//     provider.isMetaMask = false

//     let didCloseModal = false
//     while (didCloseModal === false) {
//       // Wait a reasonable amount of time to see if the popup has closed
//       await this.sleep(3000)
//       didCloseModal = await signIn()
//     }
//   }
//   ulInit = async () => {
//     window.sessionStorage.setItem('walletSelection', 'universalLogin')
//     console.log('TODO')
//   }
//   web3Init = async signIn => {
//     window.sessionStorage.setItem('walletSelection', 'metaMask')
//     await window.ethereum.enable()
//     await signIn()
//   }

//   isWeb3 = () => {
//     if (window.ethereum) {
//       return true
//     }
//     return false
//   }
//   render() {
//     return (
//       <GlobalConsumer>
//         {({signIn, closeModal, networkState}) => (
//           <>
//             <TitleContainer>Choose your wallet</TitleContainer>
//             <WalletsContainer>
//               {this.state.isWeb3Injected && (
//                 <>
//                   <LogoContainer>
//                     <LogoText>
//                       I am connected to Metamask, Status.im, etc.
//                     </LogoText>
//                     <WebThreeLogo src={WebThreeImage} />
//                     <LogoButton
//                       onClick={async () => {
//                         await this.web3Init(signIn)
//                         closeModal({name: WALLET_MODAL})
//                       }}
//                     >
//                       Web3
//                     </LogoButton>
//                   </LogoContainer>
//                 </>
//               )}
//               <LogoContainer>
//                 <LogoText>I am not connected to an Ethereum wallet</LogoText>
//                 <AuthereumLogo />
//                 <LogoButton
//                   onClick={() => {
//                     this.authereumInit(networkState, signIn)
//                     closeModal({name: WALLET_MODAL})
//                   }}
//                 >
//                   Authereum
//                 </LogoButton>
//               </LogoContainer>
//             </WalletsContainer>
//           </>
//         )}
//       </GlobalConsumer>
//     )
//   }
// }
