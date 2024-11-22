import vid from '../photos/vid2.mp4'
export default function About () {
    return(
        <div className="about">
            <div className="container">
                <div className="vid">
                <video muted loop autoPlay src={vid}></video>
                <ul>
                <li><p>ABDI Naila</p></li>
                <li><p>AMIMER Abderrahmane Mohamed Elmahdi</p></li>
                <li><p>AOUDIA Djahid</p></li>
                <li><p>BOUREKIA Nihad </p></li>
                <li><p>Dhairi Fatima Ez-zahra </p></li>
                <li><p>SEDDIKI Aridj </p></li>
                <li><p>Zeghouf Samir</p></li>
                <li><p>Zouaoui Mohamed </p></li>

                </ul>
                </div>
            </div>
        </div>
    )
}