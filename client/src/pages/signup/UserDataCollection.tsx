/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@components/Button";
import EnterKey from "@assets/enter-key.svg";
import LeftChevron from "@assets/left-chevron.svg";

type UserDataCollectionProps = {
    step: number;
    onSubmit: () => void;
    onBack: () => void;
}

export function UserDataCollectionWrapper({ step, onSubmit, onBack }: UserDataCollectionProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            marginTop: '4rem',
        }}>
            <Button variant="text" onClick={onBack} styles={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontWeight: 'bold',
            }}>
                <LeftChevron />
                <span style={{
                    paddingTop: '0.14375rem'
                }}>Back</span>
            </Button>
            {/* <button style={{
                background: 'none',
                border: 'none',
                fontFamily: 'fustat',
                fontWeight: 'bold',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
            }}>
                <LeftChevron />
                <span style={{
                    paddingTop: '0.14375rem'
                }}>Back</span>
            </button> */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
            }}>

                <DataCollect />
                <div style={{
                    width: '40%',
                }}>
                    <Stepper />
                </div>
            </div>
        </div>
    )
}

function Password() {
    return (
        <>
            <label
                htmlFor=""
                style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                }}
            >
                Your Top Secret Password
            </label>

            <input
                type="password"
                placeholder="type here"
                style={{
                    fontFamily: "fustat",
                    border: "none",
                    width: "100%",
                    fontSize: "3rem",
                    fontWeight: "bold",
                }}
                className="email-register"
            />

            <small>At least 12 characters</small>
        </>
    )
}

// function FullName() {
//     return (
//         <>
//             <label
//                 style={{
//                     fontSize: "2rem",
//                     fontWeight: "bold",
//                 }}
//             >
//                 Your Full Name
//             </label>

//             <input
//                 type="text"
//                 placeholder="type here"
//                 style={{
//                     fontFamily: "fustat",
//                     border: "none",
//                     width: "100%",
//                     fontSize: "3rem",
//                     fontWeight: "bold",
//                 }}
//                 className="email-register"
//                 autoFocus
//             />
//         </>
//     )
// }


function DataCollect() {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "center",
        gap: "3rem",
    }}>

        <Password />

        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
        }}>
            <Button color="primary" size="lg" shape="pill">
                Next
            </Button>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.75rem'
            }}>
                <div style={{
                    backgroundColor: '#FFC2C2',
                    borderRadius: '.5rem',
                    padding: '.5rem',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <EnterKey />
                </div>
                <span>Or press Enter</span>
            </div>
        </div>
    </div>
}

function Stepper() {
    return (
        <>
            <ol className="c-stepper">
                <li className="c-stepper__item complete">
                    <div className="c-stepper__content">
                        <h3 className="c-stepper__title">
                            Step 1
                        </h3>
                        <p>Terms consent and an email to we keep in touch</p>
                    </div>
                </li>
                <li className="c-stepper__item complete">
                    <div className="c-stepper__content">
                        <h3 className="c-stepper__title">
                            Step 2
                        </h3>
                        <p>How do you prefer we call you?</p>
                    </div>
                </li>
                <li className="c-stepper__item current">
                    <div className="c-stepper__content">
                        <h3 className="c-stepper__title">
                            Step 3
                        </h3>
                        <p>Your secret password (We will keep in safe)</p>
                    </div>
                </li>
                <li className="c-stepper__item">
                    <div className="c-stepper__content complete">
                        <h3 className="c-stepper__title">
                            Step 4
                        </h3>
                        <p>We need that you confirm your password</p>
                    </div>
                </li>
            </ol>
        </>
    )
}