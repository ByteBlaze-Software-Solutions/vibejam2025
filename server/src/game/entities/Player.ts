import { Vector3 } from '../../../shared/types/Vector3';
import { PlayerState } from '../../../shared/types/GameState';

export class Player {
  private id: string;
  private isBot: boolean;
  private health: number = 100;
  private maxHealth: number = 100;
  private position: Vector3 = { x: 0, y: 1.7, z: 0 };
  private rotation: Vector3 = { x: 0, y: 0, z: 0 };
  private velocity: Vector3 = { x: 0, y: 0, z: 0 };
  private score: number = 0;
  private kills: number = 0;
  private deaths: number = 0;
  private respawnTime: number = 3; // seconds
  private _isDead: boolean = false;
  private lastDeathTime: number = 0;
  private currentWeapon: string = 'pistol';
  private weapons: string[] = ['pistol'];
  private ammo: Record<string, number> = {
    pistol: 20,
    shotgun: 0,
    rocketLauncher: 0,
    railgun: 0
  };
  
  constructor(id: string, isBot: boolean = false) {
    this.id = id;
    this.isBot = isBot;
  }
  
  getId(): string {
    return this.id;
  }
  
  isABot(): boolean {
    return this.isBot;
  }
  
  getHealth(): number {
    return this.health;
  }
  
  getPosition(): Vector3 {
    return { ...this.position };
  }
  
  getRotation(): Vector3 {
    return { ...this.rotation };
  }
  
  getVelocity(): Vector3 {
    return { ...this.velocity };
  }
  
  getScore(): number {
    return this.score;
  }
  
  getKills(): number {
    return this.kills;
  }
  
  getDeaths(): number {
    return this.deaths;
  }
  
  getCurrentWeapon(): string {
    return this.currentWeapon;
  }
  
  getWeapons(): string[] {
    return [...this.weapons];
  }
  
  getAmmo(weapon: string): number {
    return this.ammo[weapon] || 0;
  }
  
  isDead(): boolean {
    return this._isDead;
  }
  
  setPosition(position: Vector3): void {
    this.position = { ...position };
  }
  
  setRotation(rotation: Vector3): void {
    this.rotation = { ...rotation };
  }
  
  setVelocity(velocity: Vector3): void {
    this.velocity = { ...velocity };
  }
  
  takeDamage(amount: number): void {
    if (this._isDead) return;
    
    this.health = Math.max(0, this.health - amount);
    
    if (this.health === 0) {
      this.die();
    }
  }
  
  heal(amount: number): void {
    if (this._isDead) return;
    
    this.health = Math.min(this.maxHealth, this.health + amount);
  }
  
  die(): void {
    if (this._isDead) return;
    
    this._isDead = true;
    this.deaths++;
    this.lastDeathTime = Date.now();
  }
  
  respawn(position: Vector3): void {
    this._isDead = false;
    this.health = this.maxHealth;
    this.position = { ...position };
    this.velocity = { x: 0, y: 0, z: 0 };
  }
  
  addScore(points: number): void {
    this.score += points;
  }
  
  addKill(): void {
    this.kills++;
    this.addScore(10); // 10 points per kill
  }
  
  pickupWeapon(weapon: string): void {
    if (!this.weapons.includes(weapon)) {
      this.weapons.push(weapon);
    }
    this.currentWeapon = weapon;
  }
  
  switchWeapon(weapon: string): boolean {
    if (this.weapons.includes(weapon)) {
      this.currentWeapon = weapon;
      return true;
    }
    return false;
  }
  
  addAmmo(weapon: string, amount: number): void {
    if (this.ammo[weapon] !== undefined) {
      this.ammo[weapon] += amount;
    } else {
      this.ammo[weapon] = amount;
    }
  }
  
  useAmmo(weapon: string, amount: number = 1): boolean {
    if (!this.weapons.includes(weapon)) {
      return false;
    }
    
    if (!this.ammo[weapon] || this.ammo[weapon] < amount) {
      return false;
    }
    
    this.ammo[weapon] -= amount;
    return true;
  }
  
  update(deltaTime: number): void {
    // Handle respawning
    if (this._isDead) {
      const now = Date.now();
      const timeDeadSeconds = (now - this.lastDeathTime) / 1000;
      
      if (timeDeadSeconds >= this.respawnTime) {
        // In a real implementation, we would respawn at a specific position
        const respawnPosition = { x: 0, y: 1.7, z: 0 };
        this.respawn(respawnPosition);
      }
    }
    
    // For bots, implement AI behavior
    if (this.isBot) {
      this.updateBot(deltaTime);
    }
  }
  
  private updateBot(deltaTime: number): void {
    // Implement simple AI behavior
    if (this._isDead) return;
    
    // In a real implementation, this would include pathfinding, targeting, etc.
    
    // Simulate random movement for now
    if (Math.random() < 0.05) {
      this.velocity.x = (Math.random() - 0.5) * 5;
      this.velocity.z = (Math.random() - 0.5) * 5;
    }
    
    // Update position based on velocity
    this.position.x += this.velocity.x * deltaTime;
    this.position.z += this.velocity.z * deltaTime;
    
    // Apply some friction
    this.velocity.x *= 0.9;
    this.velocity.z *= 0.9;
  }
  
  getState(): PlayerState {
    return {
      id: this.id,
      isBot: this.isBot,
      health: this.health,
      position: this.position,
      rotation: this.rotation,
      velocity: this.velocity,
      score: this.score,
      kills: this.kills,
      deaths: this.deaths,
      isDead: this._isDead,
      currentWeapon: this.currentWeapon,
      weapons: this.weapons,
      ammo: this.ammo
    };
  }
} 