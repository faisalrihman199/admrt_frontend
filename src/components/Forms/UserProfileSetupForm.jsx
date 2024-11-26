import React from "react";
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Stepper,
    Step,
} from "@material-tailwind/react";
// import { HomeIcon, CogIcon, UserIcon } from "@heroicons/react/24/outline";

export function UserProfileSetupForm() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [isLastStep, setIsLastStep] = React.useState(false);
    const [isFirstStep, setIsFirstStep] = React.useState(true);

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    return (
        <Card className="p-5" color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
                Complete your profile
            </Typography>

            <Stepper
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
                style={{ display: "none" }}
            >
                <Step onClick={() => setActiveStep(0)}>
                    {/* <HomeIcon className="h-5 w-5" /> */}
                </Step>
                <Step onClick={() => setActiveStep(1)}>
                    {/* <UserIcon className="h-5 w-5" /> */}
                </Step>

            </Stepper>

            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                {activeStep === 0 && (
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Your Full name/ Business name
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="name@mail.com"
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>
                )}

                {activeStep === 1 && (
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Select some topics
                        </Typography>
                        <Checkbox color="blue" text="Topic 1" />
                        <Checkbox color="blue" text="Topic 2" />
                        <Checkbox color="blue" text="Topic 3" />
                        {/* Add more topics here */}
                    </div>
                )}
                <div className="mt-16 flex justify-between">
                    <Button onClick={handlePrev} disabled={isFirstStep}>
                        Prev
                    </Button>
                    <Button onClick={handleNext} disabled={isLastStep}>
                        Next
                    </Button>
                </div>
            </form>
        </Card>
    );
}