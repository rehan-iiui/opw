// ============================================================
// PLAYER ANIMATION SYSTEM
// ============================================================

class PlayerAnimation {

    constructor(player, movement) {

        this.player = player;
        this.movement = movement;

        this.time = 0;

        this.walkCycle = 0;
        this.runCycle = 0;

        this.baseArmRotation = 0;
        this.baseLegRotation = 0;
    }


    update(delta) {

        if (!this.player) {
            return;
        }

        this.time += delta;


        // ----------------------------------------------------
        // FIND CHARACTER PARTS
        // ----------------------------------------------------

        const leftArm =
            this.player.leftArm;

        const rightArm =
            this.player.rightArm;

        const leftLeg =
            this.player.leftLeg;

        const rightLeg =
            this.player.rightLeg;


        if (
            !leftArm ||
            !rightArm ||
            !leftLeg ||
            !rightLeg
        ) {
            return;
        }


        // ----------------------------------------------------
        // MOVEMENT STATE
        // ----------------------------------------------------

        const moving =
            this.movement &&
            this.movement.isMoving;

        const running =
            this.movement &&
            this.movement.isRunning;

        const grounded =
            this.movement &&
            this.movement.isGrounded;


        // ----------------------------------------------------
        // IDLE ANIMATION
        // ----------------------------------------------------

        if (!moving && grounded) {

            const breathing =
                Math.sin(this.time * 2) *
                0.015;

            this.player.body.scale.y =
                1 + breathing;


            this.smoothRotation(
                leftArm,
                "x",
                0,
                delta,
                8
            );

            this.smoothRotation(
                rightArm,
                "x",
                0,
                delta,
                8
            );

            this.smoothRotation(
                leftLeg,
                "x",
                0,
                delta,
                8
            );

            this.smoothRotation(
                rightLeg,
                "x",
                0,
                delta,
                8
            );

            return;
        }


        // ----------------------------------------------------
        // JUMP ANIMATION
        // ----------------------------------------------------

        if (!grounded) {

            this.smoothRotation(
                leftArm,
                "x",
                -0.35,
                delta,
                8
            );

            this.smoothRotation(
                rightArm,
                "x",
                -0.35,
                delta,
                8
            );

            this.smoothRotation(
                leftLeg,
                "x",
                0.2,
                delta,
                8
            );

            this.smoothRotation(
                rightLeg,
                "x",
                -0.2,
                delta,
                8
            );

            return;
        }


        // ----------------------------------------------------
        // WALK / RUN CYCLE
        // ----------------------------------------------------

        const speed =
            running
                ? 12
                : 7;


        const amplitude =
            running
                ? 0.75
                : 0.5;


        this.walkCycle +=
            delta * speed;


        const swing =
            Math.sin(this.walkCycle) *
            amplitude;


        // Arms move opposite to legs

        leftArm.rotation.x =
            swing;

        rightArm.rotation.x =
            -swing;


        leftLeg.rotation.x =
            -swing;

        rightLeg.rotation.x =
            swing;


        // ----------------------------------------------------
        // RUNNING BODY BOB
        // ----------------------------------------------------

        if (running) {

            const bob =
                Math.abs(
                    Math.sin(this.walkCycle)
                ) * 0.06;

            this.player.position.y =
                bob;

        }
        else {

            this.player.position.y = 0;

        }


        // ----------------------------------------------------
        // RUNNING ARM MOVEMENT
        // ----------------------------------------------------

        if (running) {

            leftArm.rotation.z =
                Math.sin(
                    this.walkCycle
                ) * 0.08;

            rightArm.rotation.z =
                -Math.sin(
                    this.walkCycle
                ) * 0.08;

        }
        else {

            leftArm.rotation.z = 0;
            rightArm.rotation.z = 0;

        }

    }


    // ========================================================
    // SMOOTH ROTATION
    // ========================================================

    smoothRotation(
        object,
        axis,
        target,
        delta,
        speed
    ) {

        object.rotation[axis] +=
            (
                target -
                object.rotation[axis]
            ) *
            Math.min(
                1,
                delta * speed
            );
    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.walkCycle = 0;
        this.runCycle = 0;

    }
}
