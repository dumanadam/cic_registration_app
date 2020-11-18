import { updateLocale } from "moment";

const PrivacyPolicy = () => {
  let whyPrivacy =
    "Due to contact tracing requirements, CIC together with AdhanSoft has developed this custom app to ensure attendees information is not shared or sold maintaining maximum privacy while fullfulling Victorian contact tracing requirements.";
  let durationPrivacy =
    "Your personal information will be stored on our servers encrypted, salted and hashed at rest as well as during transport. Attendance information is stored as required by law and automatically destroyed by the system after 28 days, unless otherwise required by public health officials in the event of a Coronavirus (COVID-19) outbreak.";
  let whatPrivacy =
    "As part of being Covid Safe CIC requires you to record your contact details and duration at our premises, if not you may be contacted by Victorian Health compliance officers.";
  let sharingPrivacy =
    "Your information will NOT be used for marketing or research purposes, given or sold to ANYBODY unless required by law. If you wish your details to be kept by Coburg Islamic Centre for emails and future event updates you may choose to do so. Depending on the nature of your dealings with us, we may collect and hold other types of anonymised information such as pages visited for analytical purposes and for improving this app. the data will only be used to provide you with those services.";
  let howPrivacy =
    "Records can be kept electronically or in hard copy. Any information stored on our servers are encrypted, salted and hashed at rest as well as during transport. All visit data is destroyed after 28 days";
  let outPrivacy =
    "It is your responsibility to record the ‘out-time’ on leaving CIC, if this is not recorded, you may be contacted by Victorian health authorities.";
  let deletePrivacy =
    "You may delete your account at any time and all associated data will be immediatly deleted permanently. If you have attended our premises your account will be deleted permanently by the system after 28 days as required by law. You may do this via the update details section of the app after logging in.";
  function modalText() {
    return (
      <>
        <div className="col h-100">
          <div>
            <strong>Why : </strong> {whyPrivacy}
          </div>
          <div className="mt-2">
            <strong>Personal Information : </strong> {durationPrivacy}
          </div>
          <div className="mt-2">
            <strong>What Information : </strong> {whatPrivacy}
          </div>
          <div className="mt-2">
            <strong>Information sharing : </strong> {sharingPrivacy}
          </div>
          <div className="mt-2">
            <strong>Security : </strong> {howPrivacy}
          </div>
          <div className="mt-2">
            <strong>Time Recording : </strong> {outPrivacy}
          </div>
          <div className="mt-2">
            <strong>Delete Account : </strong> {deletePrivacy}
          </div>
        </div>
      </>
    );
  }
  return modalText();
};

export default PrivacyPolicy;
