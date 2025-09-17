function SectionHeader({ title, mb = 0 }: { title: string, mb: number }) {

  const marginBottom = `mb-${mb}`;
  return (
    <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent ${marginBottom}`}>
      {title}
    </div>
  )
}

export default SectionHeader