use anchor_lang::prelude::*;

declare_id!("Fg6PaFzn4fR6jorJpegFrNK4zMk7kL3k8Fc9SP2gAubT"); // Update with your program ID after deployment

#[program]
pub mod solana_hall_of_fame {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, game_id: String) -> Result<()> {
        let hall_of_fame = &mut ctx.accounts.hall_of_fame;
        hall_of_fame.owner = *ctx.accounts.user.key;
        hall_of_fame.game_id = game_id;
        Ok(())
    }

    pub fn submit_score(ctx: Context<SubmitScore>, player_name: String, score: u64) -> Result<()> {
        let hall_of_fame = &mut ctx.accounts.hall_of_fame;
    
        // Check owner
        require!(*ctx.accounts.user.key == hall_of_fame.owner, ErrorCode::Unauthorized);
    
        let mut inserted = false;
        for i in (0..hall_of_fame.high_scores.len()).rev() {
            if i < 9 && score > hall_of_fame.high_scores[i].score {
                hall_of_fame.high_scores[i + 1] = hall_of_fame.high_scores[i].clone(); // Use clone here
                inserted = true;
            }
        }
        if inserted {
            // Find the right spot to place the new score
            for i in (0..hall_of_fame.high_scores.len()).rev() {
                if score > hall_of_fame.high_scores[i].score {
                    hall_of_fame.high_scores[i] = HighScore { player_name: player_name.clone(), score };
                } else {
                    break;
                }
            }
        }
    
        Ok(())
    }
    
}

#[account]
pub struct HallOfFame {
    pub owner: Pubkey,
    pub game_id: String,
    pub high_scores: [HighScore; 10],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct HighScore {
    player_name: String,
    score: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 10 * 40)]
    pub hall_of_fame: Account<'info, HallOfFame>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitScore<'info> {
    pub hall_of_fame: Account<'info, HallOfFame>,
    pub user: Signer<'info>,
}


#[error_code]
pub enum ErrorCode {
    Unauthorized,
}