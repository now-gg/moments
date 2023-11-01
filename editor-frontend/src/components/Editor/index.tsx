import Player from "../Player";
type EditorProps = {
    loggedIn: boolean,
};
const Editor = ({ loggedIn }: EditorProps) => {
    return (
        <section style={{ flex: 1 }}>
            <Player loggedIn={loggedIn} />
        </section>
    );
};

export default Editor;
