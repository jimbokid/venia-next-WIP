export default function CmsRenderer({ page }) {
    return (
        <article>
            <h1>{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
        </article>
    );
}
