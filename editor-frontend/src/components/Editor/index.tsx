import Player from "../Player";

type EditorProps = {
    url: string;
};

const Editor = ({ url }: EditorProps) => {
    return (
        <section>
            <Player url={url} />
        </section>
    );
};

export default Editor;
