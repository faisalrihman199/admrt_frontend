import { Button, Dialog, DialogFooter } from "@material-tailwind/react";

export function Modal({
    size,
    open,
    // handleOpen,
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
            // handler={handleOpen}
            animate={animate}
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </div>
            {/* <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    // onClick={() => handleOpen(null)}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                // onClick={() => handleOpen(null)}
                >
                    <span>Confirm</span>
                </Button>
            </DialogFooter> */}
        </Dialog>
    );
}