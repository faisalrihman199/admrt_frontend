import { Button, Dialog, DialogFooter } from "@material-tailwind/react";
import { BsFileX } from "react-icons/bs";

export function Modal({
    size,
    open,
    handleOpen,
    animate = {
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
    },
    children,
}) {

    return (
        <Dialog
            open={open}
            size={size || "md"}
            animate={animate}
            onClose={handleOpen}
        >
            <div style={{ position: 'relative' }}>
                <div className="flex justify-end">
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => handleOpen()}
                        className="m-2"
                    >
                        <BsFileX size={24} />
                    </Button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {children}
                </div>
            </div>
        </Dialog>
    );
}