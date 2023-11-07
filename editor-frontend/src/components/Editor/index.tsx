import Player from "../Player";
type EditorProps = {
    loggedIn: boolean,
    setTitle: Function,
};
const Editor = ({ loggedIn, setTitle }: EditorProps) => {
    return (
        <section style={{ flex: 1 }}>
            <Player loggedIn={loggedIn} setTitle={setTitle} />
        </section>
    );
};

export default Editor;
