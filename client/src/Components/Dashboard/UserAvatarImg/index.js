const UserAvatarImgComponent = (props) => {
    return (
        <>
            <div className="userImg">
                <span className="rounded-circle">
                    <img src={props.Img} alt="Avatar" />
                </span>
            </div>
        </>
    );
};

export default UserAvatarImgComponent;
