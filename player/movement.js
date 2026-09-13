// ============================================================
// PLAYER MOVEMENT SYSTEM
// ============================================================

class PlayerMovement {

    constructor(player) {

        this.player = player;

        this.keys = {};

        this.walkSpeed = 7;
        this.runSpeed = 11;

        this.gravity = 20;
        this.jumpPower = 8;

        this.velocityY = 0;

        this.isGrounded = true;
        this.isMoving = false;
        this.isRunning = false;

        this.cameraYaw = 0;

        this.setupKeyboard();
    }


    setupKeyboard() {

        window.addEventListener("keydown", (event) => {

            this.keys[event.code] = true;

        });


        window.addEventListener("keyup", (event) => {

            this.keys[event.code] = false;

        });
    }


    update(delta) {

        if (!this.player) {
            return;
        }


        const movement =
            new THREE.Vector3();


        // ----------------------------------------------------
        // INPUT
        // ----------------------------------------------------

        if (this.keys["KeyW"]) {
            movement.z -= 1;
        }

        if (this.keys["KeyS"]) {
            movement.z += 1;
        }

        if (this.keys["KeyA"]) {
            movement.x -= 1;
        }

        if (this.keys["KeyD"]) {
            movement.x += 1;
        }


        this.isMoving =
            movement.length() > 0;


        // ----------------------------------------------------
        // RUN
        // ----------------------------------------------------

        this.isRunning =
            this.keys["ShiftLeft"] ||
            this.keys["ShiftRight"];


        let speed =
            this.isRunning
                ? this.runSpeed
                : this.walkSpeed;


        // ----------------------------------------------------
        // MOVEMENT
        // ----------------------------------------------------

        if (this.isMoving) {

            movement.normalize();


            const forward =
                new THREE.Vector3(
                    -Math.sin(this.cameraYaw),
                    0,
                    -Math.cos(this.cameraYaw)
                );


            const right =
                new THREE.Vector3(
                    Math.cos(this.cameraYaw),
                    0,
                    -Math.sin(this.cameraYaw)
                );


            const direction =
                new THREE.Vector3();


            direction.addScaledVector(
                forward,
                -movement.z
            );


            direction.addScaledVector(
                right,
                movement.x
            );


            direction.normalize();


            this.player.position.addScaledVector(
                direction,
                speed * delta
            );


            // Rotate character toward movement

            const targetRotation =
                Math.atan2(
                    direction.x,
                    direction.z
                );


            this.player.rotation.y =
                this.smoothAngle(
                    this.player.rotation.y,
                    targetRotation,
                    Math.min(1, 10 * delta)
                );
        }


        // ----------------------------------------------------
        // JUMP
        // ----------------------------------------------------

        if (
            this.keys["Space"] &&
            this.isGrounded
        ) {

            this.velocityY =
                this.jumpPower;

            this.isGrounded = false;
        }


        // ----------------------------------------------------
        // GRAVITY
        // ----------------------------------------------------

        this.velocityY -=
            this.gravity * delta;


        this.player.position.y +=
            this.velocityY * delta;


        // ----------------------------------------------------
        // GROUND
        // ----------------------------------------------------

        if (
            this.player.position.y <= 0
        ) {

            this.player.position.y = 0;

            this.velocityY = 0;

            this.isGrounded = true;
        }


        // ----------------------------------------------------
        // WORLD BOUNDS
        // ----------------------------------------------------

        this.player.position.x =
            THREE.MathUtils.clamp(
                this.player.position.x,
                -220,
                220
            );


        this.player.position.z =
            THREE.MathUtils.clamp(
                this.player.position.z,
                -220,
                220
            );
    }


    smoothAngle(
        current,
        target,
        amount
    ) {

        let difference =
            target - current;


        while (
            difference > Math.PI
        ) {

            difference -=
                Math.PI * 2;
        }


        while (
            difference < -Math.PI
        ) {

            difference +=
                Math.PI * 2;
        }


        return current +
            difference * amount;
    }


    setCameraYaw(yaw) {

        this.cameraYaw = yaw;
    }


    getSpeed() {

        if (!this.isMoving) {
            return 0;
        }


        return this.isRunning
            ? this.runSpeed
            : this.walkSpeed;
    }
}
