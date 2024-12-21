import './index.css'

const SkillCard = props => {
  const {skillDetails} = props
  const {imageUrl, name} = skillDetails
  return (
    <li className="skill-container" key={name}>
      <img src={imageUrl} className="skill-image" alt={name} />
      <p className="skill-name">{name}</p>
    </li>
  )
}
export default SkillCard
