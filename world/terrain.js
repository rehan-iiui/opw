class WorldTerrain {

    constructor(scene) {

        this.scene = scene;

        this.size = 500;

        this.createGround();
        this.createSidewalkAreas();
    }


    createGround() {

        const geometry =
            new THREE.PlaneGeometry(
                this.size,
                this.size,
                32,
                32
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x4d8048,
                roughness: 0.9
            });

        this.ground =
            new THREE.Mesh(
                geometry,
                material
            );

        this.ground.rotation.x =
            -Math.PI / 2;

        this.ground.position.y = -0.02;

        this.ground.receiveShadow = true;

        this.scene.add(this.ground);
    }


    createSidewalkAreas() {

        const sidewalkMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x777777,
                roughness: 0.85
            });


        // Main horizontal sidewalk

        const horizontalGeometry =
            new THREE.BoxGeometry(
                this.size,
                0.08,
                5
            );

        const horizontal =
            new THREE.Mesh(
                horizontalGeometry,
                sidewalkMaterial
            );

        horizontal.position.set(
            0,
            0.04,
            13
        );

        horizontal.receiveShadow = true;

        this.scene.add(horizontal);


        // Main vertical sidewalk

        const verticalGeometry =
            new THREE.BoxGeometry(
                5,
                0.08,
                this.size
            );

        const vertical =
            new THREE.Mesh(
                verticalGeometry,
                sidewalkMaterial
            );

        vertical.position.set(
            13,
            0.04,
            0
        );

        vertical.receiveShadow = true;

        this.scene.add(vertical);
    }


    getSize() {

        return this.size;
    }
}
