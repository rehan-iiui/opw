// ============================================================
// PLAYER SYSTEM
// ============================================================

class Player {

    constructor(scene) {

        this.scene = scene;

        this.group = new THREE.Group();

        this.position = this.group.position;

        this.velocity = new THREE.Vector3();

        this.speed = 7;

        this.runSpeed = 11;

        this.jumpPower = 8;

        this.gravity = 20;

        this.isGrounded = true;

        this.isRunning = false;

        this.isMoving = false;

        this.createCharacter();

        this.scene.add(this.group);
    }


    createCharacter() {

        // BODY
        const bodyGeometry =
            new THREE.BoxGeometry(1.1, 1.6, 0.65);

        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x263b75
            });

        this.body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );

        this.body.position.y = 1.8;

        this.body.castShadow = true;

        this.group.add(this.body);


        // HEAD
        const headGeometry =
            new THREE.SphereGeometry(
                0.48,
                24,
                24
            );

        const skinMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xc98e68
            });

        this.head =
            new THREE.Mesh(
                headGeometry,
                skinMaterial
            );

        this.head.position.y = 3;

        this.head.castShadow = true;

        this.group.add(this.head);


        // HAIR
        const hairGeometry =
            new THREE.SphereGeometry(
                0.5,
                20,
                12,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            );

        const hairMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x171717
            });

        this.hair =
            new THREE.Mesh(
                hairGeometry,
                hairMaterial
            );

        this.hair.position.y = 3.15;

        this.group.add(this.hair);


        // EARS
        this.leftEar =
            this.createPart(
                0.48,
                3,
                0,
                0.16,
                0.22,
                0.18,
                0xc98e68
            );

        this.rightEar =
            this.createPart(
                -0.48,
                3,
                0,
                0.16,
                0.22,
                0.18,
                0xc98e68
            );


        // NOSE
        this.nose =
            this.createPart(
                0,
                2.96,
                -0.47,
                0.12,
                0.12,
                0.22,
                0xc98e68
            );


        // MOUTH
        this.mouth =
            this.createPart(
                0,
                2.82,
                -0.45,
                0.24,
                0.07,
                0.04,
                0x6e2929
            );


        // EYES
        this.leftEye =
            this.createPart(
                0.18,
                3.08,
                -0.43,
                0.09,
                0.09,
                0.05,
                0x111111
            );

        this.rightEye =
            this.createPart(
                -0.18,
                3.08,
                -0.43,
                0.09,
                0.09,
                0.05,
                0x111111
            );


        // ARMS
        this.leftArm =
            this.createLimb(
                -0.72,
                1.85,
                0.25,
                1.45,
                0x263b75
            );

        this.rightArm =
            this.createLimb(
                0.72,
                1.85,
                0.25,
                1.45,
                0x263b75
            );


        // HANDS
        this.leftHand =
            this.createPart(
                -0.72,
                1.05,
                0,
                0.25,
                0.25,
                0.25,
                0xc98e68
            );

        this.rightHand =
            this.createPart(
                0.72,
                1.05,
                0,
                0.25,
                0.25,
                0.25,
                0xc98e68
            );


        // LEGS
        this.leftLeg =
            this.createLimb(
                -0.32,
                0.55,
                0.3,
                1.3,
                0x20252d
            );

        this.rightLeg =
            this.createLimb(
                0.32,
                0.55,
                0.3,
                1.3,
                0x20252d
            );


        // FEET
        this.leftFoot =
            this.createPart(
                -0.32,
                -0.05,
                -0.12,
                0.35,
                0.2,
                0.6,
                0x111111
            );

        this.rightFoot =
            this.createPart(
                0.32,
                -0.05,
                -0.12,
                0.35,
                0.2,
                0.6,
                0x111111
            );
    }


    createLimb(
        x,
        y,
        width,
        height,
        color
    ) {

        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                width
            );

        const material =
            new THREE.MeshStandardMaterial({
                color
            });

        const limb =
            new THREE.Mesh(
                geometry,
                material
            );

        limb.position.set(
            x,
            y,
            0
        );

        limb.castShadow = true;

        this.group.add(limb);

        return limb;
    }


    createPart(
        x,
        y,
        z,
        width,
        height,
        depth,
        color
    ) {

        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                depth
            );

        const material =
            new THREE.MeshStandardMaterial({
                color
            });

        const part =
            new THREE.Mesh(
                geometry,
                material
            );

        part.position.set(
            x,
            y,
            z
        );

        part.castShadow = true;

        this.group.add(part);

        return part;
    }


    setPosition(x, y, z) {

        this.group.position.set(
            x,
            y,
            z
        );
    }


    getObject() {

        return this.group;
    }
}
