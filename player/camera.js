// ============================================================
// THIRD-PERSON CAMERA SYSTEM
// ============================================================

class PlayerCamera {

    constructor(camera, player) {

        this.camera = camera;
        this.player = player;

        this.yaw = 0;
        this.pitch = 0.22;

        this.distance = 7;

        this.minDistance = 3.5;
        this.maxDistance = 12;

        this.sensitivity = 0.0025;

        this.minPitch = -0.2;
        this.maxPitch = 0.65;

        this.smoothness = 0.12;

        this.targetHeight = 2.0;

        this.enabled = false;

        this.setupMouse();

        this.setupZoom();
    }


    // ========================================================
    // MOUSE CAMERA CONTROL
    // ========================================================

    setupMouse() {

        document.addEventListener(
            "mousemove",
            (event) => {

                if (!this.enabled) {
                    return;
                }


                if (
                    document.pointerLockElement ===
                    document.body ||
                    document.pointerLockElement ===
                    this.camera
                ) {

                    this.yaw -=
                        event.movementX *
                        this.sensitivity;


                    this.pitch -=
                        event.movementY *
                        this.sensitivity;


                    this.pitch =
                        THREE.MathUtils.clamp(
                            this.pitch,
                            this.minPitch,
                            this.maxPitch
                        );
                }

            }
        );
    }


    // ========================================================
    // CAMERA ZOOM
    // ========================================================

    setupZoom() {

        window.addEventListener(
            "wheel",
            (event) => {

                if (!this.enabled) {
                    return;
                }


                this.distance +=
                    event.deltaY * 0.01;


                this.distance =
                    THREE.MathUtils.clamp(
                        this.distance,
                        this.minDistance,
                        this.maxDistance
                    );

            },
            {
                passive: true
            }
        );
    }


    // ========================================================
    // ENABLE / DISABLE
    // ========================================================

    enable() {

        this.enabled = true;

    }


    disable() {

        this.enabled = false;

    }


    // ========================================================
    // UPDATE CAMERA
    // ========================================================

    update() {

        if (!this.player) {
            return;
        }


        const target =
            new THREE.Vector3(
                this.player.position.x,
                this.player.position.y +
                this.targetHeight,
                this.player.position.z
            );


        // ----------------------------------------------------
        // CAMERA DISTANCE
        // ----------------------------------------------------

        const horizontalDistance =
            this.distance *
            Math.cos(this.pitch);


        const verticalDistance =
            this.distance *
            Math.sin(this.pitch);


        // ----------------------------------------------------
        // CAMERA POSITION
        // ----------------------------------------------------

        const desiredPosition =
            new THREE.Vector3();


        desiredPosition.x =
            target.x +
            Math.sin(this.yaw) *
            horizontalDistance;


        desiredPosition.z =
            target.z +
            Math.cos(this.yaw) *
            horizontalDistance;


        desiredPosition.y =
            target.y +
            verticalDistance;


        // ----------------------------------------------------
        // SMOOTH CAMERA
        // ----------------------------------------------------

        this.camera.position.lerp(
            desiredPosition,
            this.smoothness
        );


        // ----------------------------------------------------
        // LOOK AT PLAYER
        // ----------------------------------------------------

        this.camera.lookAt(target);
    }


    // ========================================================
    // GET YAW
    // ========================================================

    getYaw() {

        return this.yaw;

    }


    // ========================================================
    // GET PITCH
    // ========================================================

    getPitch() {

        return this.pitch;

    }


    // ========================================================
    // SET DISTANCE
    // ========================================================

    setDistance(distance) {

        this.distance =
            THREE.MathUtils.clamp(
                distance,
                this.minDistance,
                this.maxDistance
            );

    }


    // ========================================================
    // RESET CAMERA
    // ========================================================

    reset() {

        this.yaw = 0;

        this.pitch = 0.22;

        this.distance = 7;

    }
}
