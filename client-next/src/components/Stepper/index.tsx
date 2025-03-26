import './Stepper.css'

type Step = {
    id: number,
    description: string,
}

type StepperProps = {
    currentStepId: number,
    steps: Step[]
}

export function Stepper({ currentStepId, steps }: StepperProps) {

    return (
        <ol className="c-stepper">
            {
                steps.map(({ id, description }) => {

                    let stepperClass = '';
                    if (currentStepId > id) stepperClass = 'complete';
                    if (currentStepId === id) stepperClass = 'current';

                    return (
                        <li key={id} className={`c-stepper__item ${stepperClass}`}>
                            <div className="c-stepper__content">
                                <h3 className="c-stepper__title">
                                    Step {id}
                                </h3>
                                <p>{description}</p>
                            </div>
                        </li>
                    )
                })
            }
        </ol>
    )

    // return (
    //     <ol className="c-stepper">
    //         <li className="c-stepper__item complete">
    //             <div className="c-stepper__content">
    //                 <h3 className="c-stepper__title">
    //                     Step 1
    //                 </h3>
    //                 <p>Terms consent and an email to we keep in touch</p>
    //             </div>
    //         </li>
    //         <li className="c-stepper__item complete">
    //             <div className="c-stepper__content">
    //                 <h3 className="c-stepper__title">
    //                     Step 2
    //                 </h3>
    //                 <p>How do you prefer we call you?</p>
    //             </div>
    //         </li>
    //         <li className="c-stepper__item current">
    //             <div className="c-stepper__content">
    //                 <h3 className="c-stepper__title">
    //                     Step 3
    //                 </h3>
    //                 <p>Your secret password (We will keep in safe)</p>
    //             </div>
    //         </li>
    //         <li className="c-stepper__item">
    //             <div className="c-stepper__content complete">
    //                 <h3 className="c-stepper__title">
    //                     Step 4
    //                 </h3>
    //                 <p>We need that you confirm your password</p>
    //             </div>
    //         </li>
    //     </ol>
    // )
}