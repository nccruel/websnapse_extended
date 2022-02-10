import { useEffect, useState } from "react"
import { Prompt } from "react-router-dom";

const useUnsavedChanges = () =>{
    const [isDirty, setDirty] = useState(false);
    const message = "Are you sure you want to exit without saving your system?"
    useEffect(()=>{
        // function handleUnsavedChanges (){
        //     console.log("isDirty:" + isDirty);
        // }
        window.onbeforeunload = isDirty && (() => message);

        //window.addEventListener("beforeunload", handleUnsavedChanges);
        return () => {
            //window.removeEventListener("beforeunload", handleUnsavedChanges);
            window.onbeforeunload = null;
        }
    },[isDirty]);
    const routerPrompt = <Prompt when={isDirty} message={message} />
    return [routerPrompt, ()=>setDirty(true), ()=>setDirty(false)];
}
export default useUnsavedChanges;