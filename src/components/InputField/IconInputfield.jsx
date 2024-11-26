import { Input } from "@material-tailwind/react";

export function InputIcon({ IconComponent, setChange }) {
    return (
        <div className="w-full m-2 p-5">
            <Input
                label="youtube link"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                icon={<IconComponent color='red' />}
                onChange={(e) => setChange(e.target.value)}
                style={{ height: '3rem', border: '1px solid black', width: '100%' }}
            />
        </div>
    );
}