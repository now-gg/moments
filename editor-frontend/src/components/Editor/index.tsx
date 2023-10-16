import Player from "../Player";

type EditorProps = {
    url: string;
};

const Editor = ({ url }: EditorProps) => {
    return (
        <section style={{ flex: 1 }}>
            <Player url={url} />
        </section>
    );
};

export default Editor;
