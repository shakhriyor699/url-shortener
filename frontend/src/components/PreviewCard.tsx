

const PreviewCard = ({ meta }: { meta: any }) => {
  return (
    <div className="preview-card">
      {meta.image ? (
        <div className="preview-image">
          <img src={meta.image} alt={meta.title || 'preview'} />
        </div>
      ) : null}
      <div className="preview-body">
        <h3>{meta.title || 'No title'}</h3>
        <p>{meta.description || 'No description available.'}</p>
      </div>
    </div>
  )
}

export default PreviewCard